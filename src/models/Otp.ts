import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface OtpAttributes {
  id: string;
  userId: string;
  code: string;
  expiresAt: Date;
  createdAt?: Date;
}

export interface OtpCreationAttributes extends Optional<OtpAttributes, 'id'> {}

export class Otp extends Model<OtpAttributes, OtpCreationAttributes> implements OtpAttributes {
  public id!: string;
  public userId!: string;
  public code!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
}

Otp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize, tableName: 'otps', updatedAt: false },
);