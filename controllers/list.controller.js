const { Lists } = require("../constants");
const { MajorResearch, VolumeIssue, Article } = require("../models");

exports.create = async (req, res) => {
  try {
    const { type, ...data } = req.body;

    let result;
    switch (parseInt(type)) {
      case Lists.MAJOR_RESEARCH:
        result = new MajorResearch(data);
        break;

      case Lists.VOLUME_ISSUE:
        let payload = { ...data };
        if (data.parent) {
          if (!req.file) {
            return res.status(400).send("Image is required");
          } else {
            payload = { ...payload, filename: req.file.filename };
          }
        }
        result = new VolumeIssue(payload);
        break;

      default:
        break;
    }
    if (!result) {
      return res.status(400).send("invalid data");
    }

    await result.save();
    res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.remove = async (req, res) => {
  try {
    const { type, id } = req.query;
    console.log(type, id);
    switch (+type) {
      case Lists.MAJOR_RESEARCH:
        await MajorResearch.findByIdAndUpdate(id, {
          isDeleted: true,
        });
        break;

      case Lists.VOLUME_ISSUE:
        await VolumeIssue.findByIdAndUpdate(id, {
          isDeleted: true,
        });
        break;

      default:
        break;
    }

    res.json({ success: true });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.update = async (req, res) => {
  try {
    console.log(req.body, req.file);
    let { type, id, ...data } = req.body;
    if (req.file) {
      data = { ...data, filename: req.file.filename };
    }

    switch (parseInt(type)) {
      case Lists.MAJOR_RESEARCH:
        await MajorResearch.findByIdAndUpdate(id, {
          ...data,
        });
        break;

      case Lists.VOLUME_ISSUE:
        await VolumeIssue.findByIdAndUpdate(id, {
          ...data,
        });
        break;

      default:
        break;
    }

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.get = async (req, res) => {
  try {
    let result;

    switch (parseInt(req.query?.type)) {
      case Lists.MAJOR_RESEARCH:
        result = await MajorResearch.aggregate([
          { $match: { parent: { $exists: false }, isDeleted: false } },
          {
            $lookup: {
              from: "majors_researches",
              localField: "_id",
              foreignField: "parent",
              as: "researches",
            },
          },
        ]);
        break;

      case Lists.VOLUME_ISSUE:
        result = await VolumeIssue.aggregate([
          { $match: { parent: { $exists: false }, isDeleted: false } },
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "volumes_issues",
              localField: "_id",
              foreignField: "parent",
              as: "issues",
            },
          },
        ]);
        break;

      default:
        const [majors, volumes, totalDownload] = await Promise.all([
          MajorResearch.aggregate([
            { $match: { parent: { $exists: false }, isDeleted: false } },
            {
              $lookup: {
                from: "majors_researches",
                localField: "_id",
                foreignField: "parent",
                as: "researches",
              },
            },
          ]),
          VolumeIssue.aggregate([
            { $match: { parent: { $exists: false }, isDeleted: false } },
            {
              $lookup: {
                from: "volumes_issues",
                localField: "_id",
                foreignField: "parent",
                as: "issues",
              },
            },
          ]),
          Article.aggregate([
            {
              $group: {
                _id: null,
                total: { $sum: "$totalDownload" }, // for your case use local.user_totaldocs
              },
            },
          ]),
        ]);
        result = { majors, volumes, totalDownload };
        break;
    }
    if (!result) return res.json([]);

    res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
