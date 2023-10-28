import React, { useState, useEffect } from 'react';

function Albums() {
  // State variables for managing albums, adding, editing, and input data
  const [albums, setAlbums] = useState([]);
  const [newAlbum, setNewAlbum] = useState({ userId: 1, id: 0, title: '' });
  const [isAddingAlbum, setIsAddingAlbum] = useState(false);
  const [editData, setEditData] = useState({ id: null, title: '' });

  // Function to fetch albums from an external API
  const fetchAlbums = () => {
    fetch('https://jsonplaceholder.typicode.com/albums')
      .then((response) => response.json())
      .then((data) => setAlbums(data))
      .catch((error) => console.error('Error fetching albums:', error));
  };

  // Function to add or update an album, based on 'id'
  const addOrUpdateAlbum = (id) => {
    // Determine the URL based on whether it's an update or a new album
    const url = id
      ? `https://jsonplaceholder.typicode.com/albums/${id}`
      : 'https://jsonplaceholder.typicode.com/albums';

    // Determine the HTTP method (POST for new album, PUT for an update)
    const method = id ? 'PUT' : 'POST';

    // Prepare the data to be sent in the request body
    const body = JSON.stringify(id ? { title: editData.title } : newAlbum);

    // Make an HTTP request to the URL with the specified method
    fetch(url, {
      method,
      body,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (id) {
          // If it's an update, update the album in the state with the new title
          const updatedAlbums = albums.map((album) =>
            album.id === id ? { ...album, title: editData.title } : album
          );
          setAlbums(updatedAlbums); // Update the 'albums' state
          setEditData({ id: null, title: '' }); // Clear edit data
        } else {
          // If it's a new album, add the album to the state and clear new album data
          setAlbums([data, ...albums]); // Update the 'albums' state
          setNewAlbum({ userId: 1, id: 0, title: '' }); // Clear new album data
          setIsAddingAlbum(false); // Close the add album form
        }
      })
      .catch((error) => console.error('Error:', error)); // Handle any errors that occur during the request.
  };

  // Function to delete an album
  const deleteAlbum = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Remove the deleted album from the state
        const updatedAlbums = albums.filter((album) => album.id !== id);
        setAlbums(updatedAlbums); // Update the 'albums' state
      })
      .catch((error) => console.error('Error deleting album:', error)); // Handle any errors
  };

  // Function to render the list of albums
  const renderAlbums = () => {
    return albums.map((album) => (
      <div key={album.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4">
        <div className="album-card bg-white shadow-lg p-4 rounded-lg mb-4">
          {editData.id === album.id ? (
            // Edit mode
            <div>
              <input
                className="border rounded-lg p-2 w-full"
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                onClick={() => addOrUpdateAlbum(album.id)}
              >
                Save
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                onClick={() => setEditData({ id: null, title: '' })}
              >
                Cancel
              </button>
            </div>
          ) : (
            // View mode
            <div>
              <h2 className="text-xl font-semibold">{album.title}</h2>
              <div className="mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={() => setEditData({ id: album.id, title: album.title })}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  onClick={() => deleteAlbum(album.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    ));
  };

  useEffect(() => {
    // Fetch albums when the component is mounted
    fetchAlbums();
  }, []);

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg">
      <h1 className="text-2xl font-bold">Albums</h1>
      <div className="relative">
        <button
          className={`absolute top-0 right-0 bg-green-500 hover-bg-green-600 text-white px-4 py-2 rounded-t-lg`}
          onClick={() => setIsAddingAlbum(!isAddingAlbum)}
        >
          {isAddingAlbum ? 'Cancel' : 'Add Album'}
        </button>
        {isAddingAlbum && (
          <div className="mt-8">
            <input
              className="border rounded-lg p-2 w-full"
              type="text"
              placeholder="New Album Title"
              value={newAlbum.title}
              onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
            />
            <button
              className="bg-blue-500 hover-bg-blue-600 text-white px-4 py-2 mt-2 rounded-lg"
              onClick={() => addOrUpdateAlbum()}
            >
              Add Album
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap">
        {renderAlbums()}
      </div>
    </div>
  );
}

export default Albums;
