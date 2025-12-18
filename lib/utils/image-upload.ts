export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '上传失败')
  }

  const data = await response.json()
  return data.path
}

export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const paths = await Promise.all(files.map(file => uploadImage(file)))
  return paths
}

