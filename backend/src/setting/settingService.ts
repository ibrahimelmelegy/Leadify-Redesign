import { Transaction } from 'sequelize';
import { CreateOrUpdateSettingInput } from './inputs/createSettingInput';
import Setting from './settingModel';
import uploaderService from '../uploader/uploader.service';

class SettingService {
  async createOrUpdateSetting(input: CreateOrUpdateSettingInput, adminId: number, t?: Transaction): Promise<Setting> {
    let existingSetting = await Setting.findOne({});
    if (!existingSetting) {
      existingSetting = await Setting.create({});
    }

    if (input.logo) {
      await uploaderService.setFileReferences([input.logo]);
    }
    if (input.secondaryColor) {
      await uploaderService.setFileReferences([input.secondaryColor]);
    }
    existingSetting.set(input);
    return existingSetting.save();
  }

  async getSetting(): Promise<Setting | null> {
    let existingSetting = await Setting.findOne({});
    return existingSetting;
  }
}

export default new SettingService();
