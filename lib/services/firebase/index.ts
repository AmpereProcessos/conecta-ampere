import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { FILE_TYPES } from '@/configs/constants';
import { storage } from '@/configs/services/firebase';

type UploadFileParams = {
	file: File;
	fileName: string;
	vinculationId?: string;
};
export async function uploadFileToFirebaseStorage({ file, fileName, vinculationId }: UploadFileParams) {
	try {
		if (!file) throw new Error('Arquivo não fornecido.');
		const datetime = new Date().toISOString();
		const refPath = vinculationId ? `conecta/(${vinculationId}) ${fileName} - ${datetime}` : `conecta/${fileName} - ${datetime}`;
		const fileRef = ref(storage, refPath);
		const uploadResponse = await uploadBytes(fileRef, file);

		const url = await getDownloadURL(ref(storage, uploadResponse.metadata.fullPath));
		const format =
			uploadResponse.metadata.contentType && FILE_TYPES[uploadResponse.metadata.contentType]
				? FILE_TYPES[uploadResponse.metadata.contentType as keyof typeof FILE_TYPES]?.title
				: 'INDEFINIDO';
		const size = uploadResponse.metadata.size;
		return { url, format, size };
	} catch (error) {
		console.log('Error uploading file to firebase storage', error);
		throw error;
	}
}
