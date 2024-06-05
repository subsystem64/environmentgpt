"use client"
import { ChangeEvent, useState, FormEvent } from "react"

export default function Home() {
  const [ image, setImage ] = useState<string>("");
  const [ openAIResponse, setOpenAIResponse ] = useState<string>("");


  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if(event.target.files === null) {
      window.alert("No file selected. Choose a file.")
      return;
    }
    const file = event.target.files[0];

    // Convert the users file (locally on their computer) to a base64 string
    // FileReader
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      // reader.result -> base64 string ("ENTIRESTRING" -> :))
      if(typeof reader.result === "string") {
        console.log(reader.result);
        setImage(reader.result);
      }
    }

    reader.onerror = (error) => {
      console.log("error: " + error);
    }

  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if(image === "") {
      alert("Upload an image.")
      return;
    }

    // POST api/analyzeImage
    await fetch("api/analyzeImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: image // base64 image
      })
    })
    .then(async (response: any) => {

      const reader = response.body?.getReader();
      setOpenAIResponse("");

      while (true) {
        const { done, value } = await reader?.read();
        // done is true once the response is done
        if(done) {
          break;
        }

        // value : uint8array -> a string.
        var currentChunk = new TextDecoder().decode(value);
        setOpenAIResponse((prev) => prev + currentChunk);
      }
    });

  }

  return (
    <div className="min-h-screen flex items-center justify-center text-md">
      <div className=' bg-[#5689bf] w-full max-w-2xl rounded-lg shadow-md p-8'>
        <h2 className='text-xl font-bold mb-4 text-white'>EFFECTS OF CLIMATE CHANGE</h2>
        { image !== "" ?
          <div className="mb-4 overflow-hidden">
            <img 
              src={image}
              className="w-full object-contain max-h-72"
            />
          </div>
        :
        <div className="mb-4 p-8 text-center text-white">
          <p>Upload an image to see the impacts climate change will have on it in the future</p>
        </div>
        }
        

        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='flex flex-col mb-6'>
            <label className='mb-2 text-sm font-medium text-white'>Upload</label>
            <input
              type="file"
              className="text-sm border rounded-lg cursor-pointer text-white"
              onChange={(e) => handleFileChange(e)}
            />
          </div>
          
          <div className='flex justify-center'>
            <button type="submit" className='p-2 bg-[#f5eb7f] rounded-md mb-4'>
              Will it exist?
            </button>
          </div> 
        </form>

        {openAIResponse !== "" ?
        <div className="border-t border-gray-300 pt-4]" >
          <h2 className="text-xl font-bold mb-2 text-[#f5eb7f]">Response</h2>
          <p className="text-[#f5eb7f]">{openAIResponse}</p>
        </div>
        :
        null
        }
        

      </div>
    </div>
  )
}
