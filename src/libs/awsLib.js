import { Storage } from 'aws-amplify';

export const s3Upload = async (file) => {
    const filename = `${Date.now()}-${file.name}`;

    const stored = await Storage.vault.put(filename, file, {
        contentType: file.type,
    });
    console.log(stored.key)
    return stored.key;
}

