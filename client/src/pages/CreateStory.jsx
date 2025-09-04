import React, { useContext, useState } from 'react'
import { ArrowUpFromLine } from 'lucide-react';
import Loading from '../components/Loading';
import { PostContext } from '../context/PostContext';

const CreateStory = () => {

    const [content, setContent] = useState('');
    const [photo, setPhoto] = useState('');
    const [bgColor, setBgColor] = useState('bg-blue-600')
    const [creating, setCreating] = useState(false);
    const colorOptions = ['bg-blue-400', 'bg-red-400', 'bg-pink-400', 'bg-green-400', 'bg-yellow-400']

    const { createPost } = useContext(PostContext)
    

    const handleColorSelect = (color) => {
        setBgColor(color)
    }

    const handleFileSelect = (e) => {
        let file = e.target.files[0];
        if(file) {
            file = URL.createObjectURL(file);
            setPhoto(file);
        }
    }

    const handleCreate = async () => {
          if(!photo || !content) return;
          const formData = new FormData();
          formData.append('image', photo);
          formData.append('caption', content);
          setCreating(true);
          await createPost(formData);
          setCreating(false);
    }


  return (
    <div className="w-full h-full overflow-auto">

       <div className='max-w-xs:mx-[5%] max-w-xs:max-[5%] mx-[8%] mt-[8%] flex flex-col lg:flex-row md:justify-center gap-y-10 md:gap-x-10'>

         <div className='flex flex-col justify-between gap-4'>

          <div className='flex flex-col gap-4'>
             <h1 className='text-center text-white text-xl  font-semibold'>Create Story</h1>
             <textarea onChange={(e) => setContent(e.target.value)} 
             value={content} placeholder='write a caption' className={`w-full h-[160px] md:h-[190px] md:[300px] lg:w-[370px] p-3 outline-none border border-gray-300 rounded-lg text-white placeholder:text-lg  ${bgColor}`} /> 

            <div className='flex gap-2'>
                 {
                colorOptions.map((option, index) => (
                    <div onClick={() => handleColorSelect(option)} key={index} className={`w-12 h-12 ${option} border-2 border-double border-white rounded-full`}></div>
                ))
             } 
            </div>
         </div>

            <div className='w-full flex justify-between gap-3'>
                <label id='image' className='flex items-center justify-center gap-1 w-full px-4 py-2 rounded bg-gray-200'>
                    <input type="file" accept='image/*' hidden onChange={handleFileSelect}/>
                    <ArrowUpFromLine/>
                    <h1 className='font-semibold'>Photo</h1>
                </label> 
                <button className='w-full flex flex-col gap-2 items-center text-white bg-blue-600 font-semibold px-4 py-2 rounded' onClick={handleCreate}>
                    {creating && <Loading/>}Create</button>  
            </div>
         </div>

         { photo &&   <div className='flex flex-col gap-4'>
             <h1 className='text-white text-center text-xl font-semibold'>Selected Photo</h1>
             <img src={photo} alt="photo" className='w-full h-[350px] object-cover rounded'/>
         </div> }

      </div>
    </div>
  )
} 

export default CreateStory



