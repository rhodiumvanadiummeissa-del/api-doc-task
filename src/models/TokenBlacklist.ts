import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TokenBlacklistAttributes {
  id: string;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
}

export interface TokenBlacklistCreationAttributes
  extends Optional<TokenBlacklistAttributes, 'id'> {}

export class TokenBlacklist
  extends Model<TokenBlacklistAttributes, TokenBlacklistCreationAttributes>
  implements TokenBlacklistAttributes
{
  public id!: string;
  public token!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
}

TokenBlacklist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'token_blacklists',
    updatedAt: false,
  }
);