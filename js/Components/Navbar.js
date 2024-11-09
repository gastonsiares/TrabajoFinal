const navElements = [
    // { title: 'Index', link: '/html/index.html' },
    { title: 'Inicio', link: 'home.html' },
    { title: 'Iniciar Sesion', link: 'login.html' },
    ,{ title: 'Registro', link: '/html/registro.html' },
    {
        title: 'Componentes de PC',
        subItems:[
            { title: 'Monitores', link: 'monitores.html' },
            { title: 'Placas de Video', link: '/html/placaDeVideo.html'},
            { title: 'Perifericos', link: '/html/perifericos.html' },
            { title: 'Memorias Ram', link:'/html/memoriaRam.html'},
            { title: 'Procesadores',link:'/html/microProcesadores.html'},
            { title: 'Fuentes',link:'/html/fuente.html'},
            { title: 'Discos Solidos',link:'discoSolidoSsd.html'},
            { title: 'Gabinetes',link:'gabinete.html'},
            { title: 'Motherboards',link:'/html/motherboards.html'},
            { title: 'Refrigeracion',link:'refrigeracion.html'},  

        ]
    }
    


]

export const navBarComponent = `
<nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
        <a class="navbar-brand" href="index.html">logo</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
                ${navElements.map(i => {
                    // Si tiene subitems, crea el dropdown
                    if (i.subItems) {
                        return `
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    ${i.title}
                                </a>
                                <ul class="dropdown-menu">
                                    ${i.subItems.map(subItem => {
                                        return `<li><a class="dropdown-item" href="${subItem.link}">${subItem.title}</a></li>`;
                                    }).join('')}
                                </ul>
                            </li>
                        `;
                    } else {
                        // Si no tiene subitems, es un enlace normal
                        return `
                            <li class="nav-item">
                                <a class="nav-link" href="${i.link}">${i.title}</a>
                            </li>
                        `;
                    }
                }).join('')}
            </ul>
        </div>
    </div>
</nav>
`;

// export const navBarComponent = `
// <nav class="navbar navbar-expand-lg bg-body-tertiary">
//     <div class="container-fluid">
//         <a class="navbar-brand" href="index.html">logo</a>
//         <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
//         <span class="navbar-toggler-icon"></span>
//         </button>
//         <div class="collapse navbar-collapse" id="navbarNavDropdown">
//         <ul class="navbar-nav">
            
//             ${navElements.map(i => {
//                 // Verificar el subitem
//                 if(i.subItems){
//                     return`
//                      <li class="nav-item dropdown">
//                         <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
//                             ${i.title}
//                         </a>
//                         <ul class="dropdown-menu">
//                             ${i.subItems.map(subItem => {
//                                 return `<li><a class="dropdown-item" href="${subItem.link}">${subItem.title}</a></li>`;
//                             }).join('')}
//                         </ul>
//                     </li>
//                     `;
//                 }else{
//                     return `
//                     <li class="nav-item">
//                         <a class="nav-link" href=${i.link}>${i.title}</a>
//                     </li>
//                     `
//                 }
   
//                         }).join('')
//     }          
//         </ul>
//         </div>
//     </div>
//     </nav>
// `;


/*import y export 
antes de importar se debe exportar
*/