import { defineStore } from 'pinia';
import ImageUploader from 'quill-image-uploader';
import { ElNotification } from 'element-plus';

const runtimeConfig = useRuntimeConfig();

export const useMain = defineStore('Main', {
  state: () => ({
    filereturned: '',
    contentImagesUrls: [],

    openedNav: true,
    mobile: false,
    fullNav: true,
    hideNav: false,
    permissions: [],

    months: [
      { label: 'January', value: 1 },
      { label: 'February', value: 2 },
      { label: 'March', value: 3 },
      { label: 'April', value: 4 },
      { label: 'May', value: 5 },
      { label: 'June', value: 6 },
      { label: 'July', value: 7 },
      { label: 'August', value: 8 },
      { label: 'September', value: 9 },
      { label: 'October', value: 10 },
      { label: 'November', value: 11 },
      { label: 'December', value: 12 },
    ],
  }),

  actions: {
    async uploadFile(model, file) {
      const extension = file.name.slice(file.name.lastIndexOf('.'));

      let fileName = `Tatmeen-${new Date().getTime()}${extension}`;

      const myRenamedFile = new File([file], fileName, { type: file.type });
      const { data } = await useAsyncGql('generateUploadLink', {
        model: model.toUpperCase(),
        fileName: fileName,
        contentType: file.type,
        sizeInBytes: file.size,
      });
      const link = data.value?.generateUploadLink.data;
      try {
        const response = await $fetch(link, {
          method: 'PUT',
          body: myRenamedFile,
        });
        const filereturned = link?.split('?')[0].split(runtimeConfig.public.BUCKET_URL)[1];
        return filereturned;
      } catch (error) {
        ElNotification({
          title: 'Error',
          type: 'error',
          message: error,
        });
      }
    },
    uploadImagEditor() {
      return {
        name: 'imageUploader',
        module: ImageUploader,
        options: {
          upload: async (filename) => {
            return new Promise(async (resolve, reject) => {
              try {
                const fileAdded = await this.uploadFile('BLOG_COVER', filename);
                this.contentImagesUrls.push(fileAdded);

                resolve(runtimeConfig.public.BUCKET_URL + fileAdded);
              } catch (error) {
                reject('Upload failed');
                console.error('Error:', error);
              }
            });
          },
        },
      };
    },
  },
});

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file provided.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const dataUrl = reader.result;
      resolve(dataUrl);
    };

    reader.onerror = function (event) {
      reject('Error reading the file.');
    };

    reader.readAsDataURL(file);
  });
}
