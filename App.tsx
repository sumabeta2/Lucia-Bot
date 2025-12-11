import React, { useState } from 'react';

const App = () => {
  const [code, setCode] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState('login');
  const [country, setCountry] = useState('');
  const [product, setProduct] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);

  const RAMON_WHATSAPP = "51987654321"; // ← Cambia por tu número

  if (!loggedIn) {
    return (
      <div style={{fontFamily:'Arial', textAlign:'center', padding:'50px', background:'#f0f8ff'}}>
        <h1>Bienvenido</h1>
        <input 
          type="password" 
          maxLength="6"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{fontSize:'24px', padding:'10px', textAlign:'center'}}
          placeholder="Código 6 dígitos"
        />
        <br/><br/>
        <button onClick={() => code === "123456" && setLoggedIn(true)}
          style={{padding:'15px 40px', fontSize:'20px', background:'#007bff', color:'white', border:'none', borderRadius:'10px'}}>
          Entrar
        </button>
      </div>
    );
  }

  if (screen === 'login') {
    return (
      <div style={{fontFamily:'Arial', textAlign:'center', padding:'30px', background:'#f0f8ff', minHeight:'100vh'}}>
        <h1>Hola, soy Lucía</h1>
        <p style={{fontSize:'22px'}}>Asistente virtual de Ramón Delgado</p>
        <h2>¿Qué te interesa?</h2>
        <div style={{margin:'30px'}}>
          <button onClick={() => {setProduct('taller'); setScreen('country')}} style={btnStyle}>Taller Primeros Auxilios</button>
          <button onClick={() => {setProduct('libro'); setScreen('country')}} style={btnStyle}>Libros</button>
          <button onClick={() => setScreen('payment')} style={btnStyle}>Ya hice el pago</button>
          <a href={https://wa.me/${RAMON_WHATSAPP}} target="_blank" rel="noopener noreferrer">
            <button style={{...btnStyle, background:'#25d366'}}>Hablar con Ramón</button>
          </a>
        </div>
      </div>
    );
  }

  if (screen === 'country') {
    return (
      <div style={{fontFamily:'Arial', textAlign:'center', padding:'30px'}}>
        <h2>¿En qué país estás?</h2>
        {['México','Colombia','Perú','Venezuela','Otro'].map(c => (
          <button key={c} onClick={() => setCountry(c)} style={btnStyle}>{c}</button>
        ))}
        <br/><br/>
        <button onClick={() => setScreen('login')} style={smallBtn}>Volver</button>
      </div>
    );
  }

  if (screen === 'payment') {
    return (
      <div style={{fontFamily:'Arial', textAlign:'center', padding:'30px'}}>
        <h2>Ya hice el pago</h2>
        <p>Envíame:</p>
        <p>1. Captura del comprobante</p>
        <p>2. Nombre completo</p>
        <p>3. Número de identificación</p>
        <br/>
        <a href={https://wa.me/\( {RAMON_WHATSAPP}?text=Ya%20hice%20el%20pago%20del%20 \){product}} target="_blank" rel="noopener noreferrer">
          <button style={{...btnStyle, background:'#25d366'}}>Enviar a Ramón</button>
        </a>
        <br/><br/>
        <button onClick={() => setScreen('login')} style={smallBtn}>Volver</button>
      </div>
    );
  }

  return null;
};

const btnStyle = {
  display:'block', width:'90%', maxWidth:'400px', margin:'15px auto',
  padding:'20px', fontSize:'20px', background:'#007bff', color:'white',
  border:'none', borderRadius:'12px', cursor:'pointer'
};

const smallBtn = {padding:'10px 20px', background:'#666', color:'white', border:'none', borderRadius:'8px'};

export default App;