import { User } from './User';
import { Otp } from './Otp';
import { TokenBlacklist } from './TokenBlacklist';

User.hasMany(Otp, { foreignKey: 'userId', onDelete: 'CASCADE' });
Otp.belongsTo(User, { foreignKey: 'userId' });

export { User, Otp, TokenBlacklist };