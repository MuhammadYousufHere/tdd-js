import { compare, hash } from 'bcryptjs'
import { DataTypes, Model, ModelDefined, Optional } from 'sequelize'
import { sequelize } from '@/config/db'
import { IAuthDocument } from '@interfaces/auth'

const SALT_ROUND = 10

type AuthUserCreationAttributes = Optional<
  IAuthDocument,
  'id' | 'createdAt' | 'passwordResetToken' | 'passwordResetExpires'
>

const AuthModel: ModelDefined<IAuthDocument, AuthUserCreationAttributes> =
  sequelize.define(
    'auths',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilePublicId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      // addition
      lastLogin: {
        type: DataTypes.DATE,
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isIn: [['professional', 'company', 'institue']],
        },
      },
      gender: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isIn: [['male', 'femalte', 'n/a']],
        },
      },
      status: {
        allowNull: false,
        type: DataTypes.SMALLINT,
        defaultValue: 1,
      },
      loginStatus: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['active', 'inactive']],
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now,
      },
      passwordResetToken: { type: DataTypes.STRING, allowNull: true },
      passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
        {
          unique: true,
          fields: ['username'],
        },
        {
          unique: true,
          fields: ['emailVerificationToken'],
        },
      ],
    }
  )

AuthModel.addHook('beforeCreate', async (auth: Model) => {
  const hashedPassword: string = await hash(
    auth.dataValues.password as string,
    SALT_ROUND
  )
  auth.dataValues.password = hashedPassword
})

AuthModel.prototype.comparePassword = async function (
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword)
}

AuthModel.prototype.hashPassword = async function (
  password: string
): Promise<string> {
  return hash(password, SALT_ROUND)
}

// force: true always deletes the table when there is a server restart
AuthModel.sync({})
export { AuthModel }
