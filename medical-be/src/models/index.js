const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ==================== MODEL IMPORT ====================
db.Department = require("./department.model")(sequelize, DataTypes);
db.Service = require("./service.model")(sequelize, DataTypes);
db.Doctor = require("./doctor.model")(sequelize, DataTypes);
db.Appointment = require("./appointment.model")(sequelize, DataTypes);
db.ServicePackage = require("./service_package.model")(sequelize, DataTypes);
db.DoctorReview = require("./doctor_review.model")(sequelize, DataTypes);
db.PackageReview = require("./package_review.model")(sequelize, DataTypes);
db.User = require("./user.model")(sequelize, DataTypes);
db.Contact = require("./contact.model")(sequelize, DataTypes);
db.BlogPost = require("./blog_post.model")(sequelize, DataTypes);
db.DoctorDepartment = require("./doctor_department.model")(
  sequelize,
  DataTypes
);
db.PostCategory = require("./post_category.model")(sequelize, DataTypes);
db.Post = require("./post.model")(sequelize, DataTypes);

// ==================== 1-N RELATIONS ====================

db.PostCategory.hasMany(db.Post, {
  foreignKey: "post_category_id",
  as: "posts",
});

// User – Appointment (đúng)
db.User.hasMany(db.Appointment, { foreignKey: "userId" });
db.Appointment.belongsTo(db.User, { foreignKey: "userId" });

// Doctor – Appointment
db.Doctor.hasMany(db.Appointment, { foreignKey: "doctor_id" });
db.Appointment.belongsTo(db.Doctor, { foreignKey: "doctor_id" });

// ✅ Thêm ở đây:
db.User.hasOne(db.Doctor, { foreignKey: "user_id" });
db.Doctor.belongsTo(db.User, { foreignKey: "user_id" });

// Service – Appointment
db.Service.hasMany(db.Appointment, { foreignKey: "service_id" });
db.Appointment.belongsTo(db.Service, { foreignKey: "service_id" });

// ServicePackage – Appointment
db.ServicePackage.hasMany(db.Appointment, { foreignKey: "package_id" });
db.Appointment.belongsTo(db.ServicePackage, { foreignKey: "package_id" });

// Department – Appointment
db.Department.hasMany(db.Appointment, { foreignKey: "department_id" });
db.Appointment.belongsTo(db.Department, { foreignKey: "department_id" });

// DoctorReview, PackageReview, BlogPost
db.User.hasMany(db.DoctorReview, { foreignKey: "userId" });
db.DoctorReview.belongsTo(db.User, { foreignKey: "userId" });

db.Doctor.hasMany(db.DoctorReview, { foreignKey: "doctorId", as: "reviews" });
db.DoctorReview.belongsTo(db.Doctor, { foreignKey: "doctorId", as: "doctor" });

db.User.hasMany(db.PackageReview, { foreignKey: "userId" });
db.PackageReview.belongsTo(db.User, { foreignKey: "userId" });

db.ServicePackage.hasMany(db.PackageReview, {
  foreignKey: "packageId",
  as: "reviews",
});
db.PackageReview.belongsTo(db.ServicePackage, {
  foreignKey: "packageId",
  as: "package",
});

db.User.hasMany(db.BlogPost, { foreignKey: "userId", as: "posts" });
db.BlogPost.belongsTo(db.User, { foreignKey: "userId", as: "author" });

// ==================== MANY-TO-MANY RELATIONS ====================

// Doctor - Department
db.Doctor.belongsToMany(db.Department, {
  through: db.DoctorDepartment,
  as: "departments",
  foreignKey: "doctorId",
});
db.Department.belongsToMany(db.Doctor, {
  through: db.DoctorDepartment,
  as: "doctors",
  foreignKey: "departmentId",
});

// Doctor - Service
db.DoctorService = sequelize.define(
  "doctor_service",
  {},
  { timestamps: false }
);
db.Doctor.belongsToMany(db.Service, {
  through: db.DoctorService,
  as: "services",
  foreignKey: "doctorId",
});
db.Service.belongsToMany(db.Doctor, {
  through: db.DoctorService,
  as: "doctors",
  foreignKey: "serviceId",
});

// Department - Service
db.DepartmentService = sequelize.define(
  "department_service",
  {},
  { timestamps: false }
);
db.Department.belongsToMany(db.Service, {
  through: db.DepartmentService,
  as: "services",
  foreignKey: "departmentId",
});
db.Service.belongsToMany(db.Department, {
  through: db.DepartmentService,
  as: "departments",
  foreignKey: "serviceId",
});

// ServicePackage - Service
db.PackageService = sequelize.define(
  "package_service",
  {
    appliesTo: {
      type: DataTypes.TEXT,
      get() {
        const raw = this.getDataValue("appliesTo");
        return raw ? JSON.parse(raw) : [];
      },
      set(value) {
        this.setDataValue("appliesTo", JSON.stringify(value));
      },
    },
  },
  { timestamps: false }
);

db.ServicePackage.belongsToMany(db.Service, {
  through: db.PackageService,
  as: "services",
  foreignKey: "packageId",
});
db.Service.belongsToMany(db.ServicePackage, {
  through: db.PackageService,
  as: "packages",
  foreignKey: "serviceId",
});

module.exports = db;

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Doctor.belongsTo(db.User, { foreignKey: "user_id" });
db.User.hasOne(db.Doctor, { foreignKey: "user_id" });
