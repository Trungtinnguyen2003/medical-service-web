const db = require("../models");
const ServicePackage = db.ServicePackage;

const create = async (data) => {
  return await ServicePackage.create(data);
};

const getAll = async () => {
  return await ServicePackage.findAll({
    include: [
      {
        model: db.Service,
        as: "services",
        through: {
          attributes: ["appliesTo"],
        },
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const getBySlug = async (slug) => {
  return await ServicePackage.findOne({
    where: { slug },
    include: [
      {
        model: db.Service,
        as: "services",
        through: {
          attributes: ["appliesTo"],
        },
      },
    ],
  });
};

const update = async (id, data) => {
  const [affected] = await ServicePackage.update(data, { where: { id } });
  if (affected === 0) throw new Error("Không tìm thấy gói khám");
};

const remove = async (id) => {
  const deleted = await ServicePackage.destroy({ where: { id } });
  if (!deleted) throw new Error("Không tìm thấy gói khám");
};

const assignServices = async (packageId, serviceList) => {
  const pkg = await ServicePackage.findByPk(packageId);
  if (!pkg) throw new Error("Không tìm thấy gói");

  // ❗ Xoá toàn bộ bản ghi cũ trước khi insert lại
  await db.PackageService.destroy({ where: { packageId } });

  // Map dữ liệu mới để insert
  const services = serviceList.map((s) => ({
    packageId,
    serviceId: s.serviceId,
    appliesTo: JSON.stringify(s.appliesTo || []),
  }));

  // Thêm lại
  await db.PackageService.bulkCreate(services);
};

const getById = async (id) => {
  return await ServicePackage.findByPk(id, {
    include: [
      {
        model: db.Service,
        as: "services",
        through: {
          attributes: ["appliesTo"],
        },
      },
    ],
  });
};

module.exports = {
  create,
  getAll,
  getBySlug,
  update,
  remove,
  assignServices,
  getById,
};
