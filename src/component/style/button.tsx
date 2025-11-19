
import {  Pencil } from "lucide-react";


export default function GraphicButem() {
    return (
  
      <div className="flex justify-center mt-16">
        

<button
  className="relative flex overflow-hidden items-center justify-center gap-2 
             bg-black text-white font-medium rounded-md h-9 px-4 py-2 max-w-60 w-full
             text-sm shadow hover:bg-black/90 transition-all duration-300 ease-out 
             hover:ring-2 hover:ring-black hover:ring-offset-2 group"
>
  <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 
                   bg-white opacity-10 transition-all duration-1000 ease-out 
                   group-hover:-translate-x-40"></span>
  <Pencil className="w-4 h-4" />
  <span className="ml- ">Customize Your Own Design</span>
</button>

</div>

    );
}
