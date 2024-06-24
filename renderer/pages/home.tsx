import Head from 'next/head';
import React from 'react'

import * as IconsAi from 'react-icons/ai';
import Loading from '../componets/loading';
import Image from 'next/image';

declare global {
  interface Window {
    ipcRenderer: {
      invoke(channel: string, ...args: any[]): Promise<{ success: boolean, message: string }>;
    };
  }
}

export default function HomePage() { 
  const [loading, setLoading] = React.useState(false);
  const deleteTempFiles = async () => {
    setLoading(true);
    const result = await window.ipcRenderer.invoke('delete-temp-files');
    if(result.message.length > 0){
      setLoading(false);
      document.getElementById('result').innerHTML = result.message;
    }
    
  };

  return (
    <>
    <Head>
        <title>FW Clean - Apague arquivos Temporários.</title>
    </Head>
    <div className='container-log'>
      {loading === true ? <Loading /> : null}
      
      <h1><IconsAi.AiFillDelete /> Deletar Arquivos Temporários</h1>
      <p>Ao clicar em deletar, toda responsabilidade será do úsuario. Este aplicativo foi criado para sistemas WINDOWS.</p>
      <button onClick={deleteTempFiles}>Deletar Arquivos Temporários</button>
      <div className='result' id='result'>
        CLIQUE EM DELETAR...
      </div>
      <p>Desenvolvido por <a href="https://forcaweb.net" target="_blank">Força Web</a></p>   
    </div>
    <div className='ads-apps'>
      <p>Outros apps:</p>
      <a href="https://play.google.com/store/apps/details?id=net.forcaweb" target="_blank">
      <Image src="https://play-lh.googleusercontent.com/2aw8snlWysQOZeOfZv4Asf5pp_GQEZDCqFaBhlIMCvL0gTK4N4UPRBeWQv9k50c5qCY=s48-rw" width={56} height={56} alt='Rastrear Encomendas dos Correios' />
      </a>

      <a href="https://play.google.com/store/apps/details?id=net.forcaweb.cambio" target="_blank">
      <Image src="https://play-lh.googleusercontent.com/R_JLtvy9hViMXbuIO3DbOko9PUbe2QXuk58YaIjLKSFqwrXsIuIg_K5IdbsPgd3XPPI=w240-h480-rw" width={56} height={56} alt='Calcular Dólar em Real' />
      </a>
    </div>
    </>
  )
}
