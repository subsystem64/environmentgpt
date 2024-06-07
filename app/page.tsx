"use client"
import { ChangeEvent, useState, useEffect, FormEvent } from "react"

export default function Home() {
  const [ image, setImage ] = useState<string>("");
  const [ openAIResponse, setOpenAIResponse ] = useState<string>("");
  const [showingInfo, setShowingInfo] = useState(false);


  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  function handlePaste(event: ClipboardEvent) {
    if(event.clipboardData === null) {
      window.alert("No file selected. Choose a file.")
      return;
    }
    const file = event.clipboardData.files[0];

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
    function showInfo() {
      setShowingInfo(!showingInfo);
    }
  


  let response = openAIResponse;
  let responseYesNo = response.split(",")[0];
  let responseColor = responseYesNo === 'No' ? 'text-[#6acc6a]' : 'text-[#f57f7f]';
  let classResponseColor = `text-xl font-bold mb-2 ${responseColor}`;
  let backgroundImage;
  if (responseYesNo === 'No') {
    backgroundImage = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcorechristianity-trky.s3.amazonaws.com%2Fwp-content%2Fuploads%2F2020%2F01%2F12141636%2Fcc-eden-scaled.jpg&f=1&nofb=1&ipt=a613dfaf08c4b1845912e3299b2cc60468dfd77fba8fa455b30cf058dfe6e00c&ipo=images';
  } else if (responseYesNo === 'Yes') {
    backgroundImage = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpaperaccess.com%2Ffull%2F5087761.jpg&f=1&nofb=1&ipt=8c878cb14f0d865c482c13b207a3462d36d0a4f979612f44b5d77473fce5e4d8&ipo=images';
  } else {
    backgroundImage = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp4468334.jpg&f=1&nofb=1&ipt=98365425821adb42fc2726d3b862e149a9371b68745cfbf97bb5cd4e9552cf6d&ipo=images';
  }
  return (
    <div className="min-h-screen flex items-center justify-center text-md" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className=' bg-black w-full max-w-2xl rounded-lg shadow-md p-8'>
        <div className="flex justify-between items-center mb-4">
          <h2 className='text-xl font-bold text-white'>WORLD OF THE FUTURE</h2>
          <button className="m-4" onClick={showInfo}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGs67yC8K9HxtSooWsdV3LsnwGHUsMmZTeRg&s" width="30" alt="Button Image" />
          </button>
        </div>
        {/*Load image*/ 
        image !== "" ?
          <div className="mb-4 overflow-hidden">
            <img 
              src={image}
              className="w-full object-contain max-h-72"
            />
          </div>
        :
        <div className="mb-4 p-8 text-center text-white">
          <p>Upload or paste an image to see if it will be impacted by climate change</p>
        </div>
        }
        {/* Display the text box showing the information */
        showingInfo && (
          <div className="absolute inset-0 flex items-center justify-center text-md ">
            <div className="inset-0 bg-[#283544] w-full max-w-2xl rounded-lg shadow-md p-8">
              <div className="flex items-center justify-center bg-[#283544] p-4 rounded-lg relative">
              <button className="absolute top-0 right-0" onClick={showInfo}>
                <img src="https://cdn.discordapp.com/attachments/1200244674603012267/1248678704348139540/image.png?ex=66648a2a&is=666338aa&hm=de103c300a6bdb348ecb0f5b6945e8c9bb58394858934557127d0d45d8ffbf27&" width="30" alt="Close" />
              </button>
                <p className='m-2 text-xl text-white'>
                  With so much access to information nowadays, it's easy to get lost or overwhelmed. 
                  We get down to the core of climate communication by helping you answer 
                  a simple question: <strong>How will climate change affect me?</strong>
                  <br /><br /> 
                  Just upload or paste an image of something you care about, and we'll 
                  tell you if and how it will be impacted by climate change.
                  <br /><br />
                  Learn more about climate change at {' '}
                  <a href="https://www.nrdc.org/stories/what-climate-change" target="_blank" rel="noopener noreferrer" style={{color: 'skyblue'}}>
                     https://www.nrdc.org/stories/what-climate-change
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
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
              Will it be impacted?
            </button>
          </div> 
        </form>
        
        {openAIResponse !== "" ?
        <div className="border-t border-gray-300 pt-4]" >
          <h2 className={classResponseColor}>
            {responseYesNo.toUpperCase()}
          </h2>
          <p className={responseColor}>{response}</p>
        </div>
        :
        null
        }
        

      </div>
    </div>
  )
}
