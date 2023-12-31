import { useState, useRef } from "react";
import "./App.css";
import { DocumentTextIcon } from "@heroicons/react/24/solid";

const albumBucketName = "my-bucket-testing-20233";
const bucketRegion = "us-east-2";
const IdentityPoolId = "us-east-2:a8148ee2-4e28-4093-939d-2e82a5cd8cb8";
window.AWS.config.update({
  region: bucketRegion,
  credentials: new window.AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
  }),
});

const s3 = new window.AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: albumBucketName },
});

function App() {
  const fileRef = useRef<Document>();
  
  const addPhoto = () => {
    const files = fileRef.current && fileRef.current.files;
    if (!files.length) {
      return alert("Please choose a file to upload first.");
    }
    const file = files[0];
    const fileName = file.name;
    const albumPhotosKey = 'react-testing/';

    const photoKey = albumPhotosKey + fileName;

    // Use S3 ManagedUpload class as it supports multipart uploads
    const upload = new window.AWS.S3.ManagedUpload({
      params: {
        Bucket: albumBucketName,
        Key: photoKey,
        Body: file,
      },
    });

    const promise = upload.promise();

    promise.then(
      function (data) {
        debugger;
        console.log('upload success data = ', data);
        alert("Successfully uploaded photo.");
        // viewAlbum(albumName);
      },
      function (err) {
        return alert("There was an error uploading your photo: ", err.message);
      }
    );

    return false;
  };

  const prenentSubmit = (event: Event) => {
      event.preventDefault();//阻止表单的默认行为
      return false;
  }

  return (
    <div className="flex justify-center w-full">
      <form onSubmit={prenentSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Username
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      autoComplete="username"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="janesmith"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Cover photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <DocumentTextIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          ref={fileRef}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={addPhoto}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
