import { promises as fs } from 'fs';
import { join } from 'path';
import { Op } from 'sequelize';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import { FileModel } from './uploader.enum';
import { Uploader } from './uploader.model';

class UploaderService {
  public async createFile(input: any, model: FileModel): Promise<string> {
    // Validate file input
    if (!input || !input.name) {
      throw new BaseError(ERRORS.FILE_ERROR);
    }

    const maxSizeMb = Number(process.env.UPLOAD_MAX_SIZE_MB || 25) || 25;
    const maxBytes = maxSizeMb * 1024 * 1024;
    const allowed = (process.env.UPLOAD_ALLOWED_MIME || 'image/png,image/jpeg,application/pdf')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const mimeType = String(input.mimetype || '');
    const size = Number(input.size || 0);
    if (size && size > maxBytes) {
      throw new BaseError({ ...ERRORS.FILE_ERROR, message: `File too large. Max ${maxSizeMb}MB.` } as any);
    }
    if (allowed.length && mimeType && !allowed.includes(mimeType)) {
      throw new BaseError({ ...ERRORS.FILE_ERROR, message: `Unsupported file type: ${mimeType}` } as any);
    }

    // Generate file path
    const safeName = this.sanitizeFilename(String(input.name));
    const filePath = `${Date.now()}-${safeName}`;
    const uploadPath = join(process.cwd(), 'public', 'uploads');
    try {
      // Ensure the upload directory exists
      await fs.mkdir(uploadPath, { recursive: true });

      // Move file to destination using a promise wrapper for async/await
      await this.moveFile(input, join(uploadPath, filePath));

      // Log successful file upload
      console.log(`File uploaded successfully: ${filePath}`);

      // Save the file details to the database
      await Uploader.create({
        name: safeName,
        path: filePath,
        model: model
      });

      return filePath;
    } catch (error) {
      console.error(`Error uploading file: ${(<any>error).message}`);
      throw new BaseError(ERRORS.FILE_ERROR); // Handle specific file upload errors
    }
  }

  private async moveFile(input: any, destination: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      input.mv(destination, (err: any) => {
        if (err) {
          reject(new BaseError(ERRORS.FILE_ERROR));
        } else {
          resolve();
        }
      });
    });
  }

  public async setFileReferences(paths: string[]): Promise<void> {
    const files = await Uploader.findAll({
      where: {
        path: { [Op.in]: paths }
      }
    });
    //disable it for testing
    //TODO : enable on production
    //if (files.length !== paths.length) throw new BaseError(ERRORS.FILE_ERROR);

    Uploader.update(
      { hasReference: true },
      {
        where: {
          path: { [Op.in]: paths }
        }
      }
    );
  }
  public async removeFileReferences(paths: string[]): Promise<void> {
    Uploader.update(
      { hasReference: false },
      {
        where: {
          path: { [Op.in]: paths }
        }
      }
    );
  }

  private sanitizeFilename(name: string): string {
    // remove any path segments
    const base = name.replace(/\\/g, '/').split('/').pop() || 'file';
    // keep simple safe characters
    return base.replace(/[^a-zA-Z0-9._-]/g, '_');
  }
}

export default new UploaderService();
