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
db.PaymentTransaction = require("./payment_transaction")(sequelize, DataTypes);

db.ChatSession = require("./chat_session.model")(sequelize, DataTypes);
db.ChatMessage = require("./chat_message.model")(sequelize, DataTypes);
db.Medicine = require("./medicine.model")(sequelize, DataTypes);
db.CclsRequest = require("./ccls_request")(sequelize, DataTypes);
db.CclsResult = require("./ccls_result")(sequelize, DataTypes); // nếu bạn có file result

// ==================== THÊM TOA THUỐC ====================
db.Prescription = require("./prescription.model")(sequelize, DataTypes);
db.PrescriptionItem = require("./prescription_item.model")(
  sequelize,
  DataTypes
);
db.PatientProfile = require("./patient_profile.model")(sequelize, DataTypes);
db.ClinicRoom = require("./clinic_room.model")(sequelize, DataTypes);

db.User.hasMany(db.PatientProfile, {
  foreignKey: "user_id",
  as: "profiles",
});

db.PatientProfile.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "user",
});

// Prescription 1 - N PrescriptionItem
db.Prescription.hasMany(db.PrescriptionItem, {
  foreignKey: "prescription_id",
  as: "items",
  onDelete: "CASCADE",
});
db.PrescriptionItem.belongsTo(db.Prescription, {
  foreignKey: "prescription_id",
});

// Prescription thuộc về Appointment
db.Prescription.belongsTo(db.Appointment, {
  foreignKey: "appointment_id",
});

// Prescription thuộc về Doctor (user)
db.Prescription.belongsTo(db.User, {
  as: "prescribedDoctor",
  foreignKey: "doctor_id",
});

// PrescriptionItem thuộc về Medicine
db.PrescriptionItem.belongsTo(db.Medicine, {
  foreignKey: "medicine_id",
});

db.Post = require("./post.model")(sequelize, DataTypes);
db.Consultation = require("./consultation.model")(
  sequelize,
  Sequelize.DataTypes
);

db.TimeSlot = require("./time_slot.model")(sequelize, DataTypes);
db.DoctorSchedule = require("./doctor_schedule.model")(sequelize, DataTypes);

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
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false }
);

db.DoctorService.belongsTo(db.Department, {
  foreignKey: "departmentId",
  as: "department",
});

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
// ✅ Thêm 3 dòng quan trọng dưới đây:
db.DoctorService.belongsTo(db.Doctor, { foreignKey: "doctorId", as: "doctor" });
db.DoctorService.belongsTo(db.Service, {
  foreignKey: "serviceId",
  as: "service",
});
db.DoctorService.belongsTo(db.Department, {
  foreignKey: "departmentId",
  as: "assignedDepartment",
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

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Associate PaymentTransaction (quan trọng)

module.exports = db;

db.Doctor.belongsTo(db.User, { foreignKey: "user_id" });
db.User.hasOne(db.Doctor, { foreignKey: "user_id" });
