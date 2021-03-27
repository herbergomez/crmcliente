import React,{useState} from 'react';
import Layout from '../components/layout';
import {gql,useMutation} from '@apollo/client';
import {useFormik} from 'formik';
import {useRouter} from 'next/router';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input:$input){
            id
            nombre
            existencia
            precio
        }
    }
`;
const OBTENER_PRODUCTOS = gql`
    query obtenerProductos{
        obtenerProductos{
            id
            nombre
            existencia
            precio
        }
    }
`;
const NuevoProducto = () =>{
    const router = useRouter();
    //State para el mensaje
    const [mensaje,guardarMensaje]= useState(null);

    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO,{
        update(cache,{data:{nuevoProducto}}) {
            //Obtener el objeto de cache que deseamos actualizar
            const {obtenerProductos}  = cache.readQuery({query:OBTENER_PRODUCTOS});
            
            //Reescribimos el cache (el cache nunca se debe de modificar)
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data:{
                    obtenerProductos:[...obtenerProductos,nuevoProducto ]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues:{
            nombre:'',
            precio:'',
            existencia:''
        },
        validationSchema:Yup.object({
            nombre:Yup.string().required('El nombre es requerido'),
            precio:Yup.number().required('El precio es requerido').positive('El precio debe ser mayor o igual a 0'),
            existencia:Yup.number().required('La existencia es requerida').positive('La cantidad disponible debe ser mayor o igual 0').integer('La existencia debe ser un numero entero')
        }),
        onSubmit:async valores=>{
            const {nombre, precio,existencia}=valores;
            try {
              const {data} = await nuevoProducto({
                    variables:{
                        input:{
                            nombre,
                            precio,
                            existencia
                        }
                    }
               });
              
               // guardarMensaje(`Se creo correctamente el producto: ${data.nuevoProducto.nombre}`);
               // setTimeout(()=>{
                //guardarMensaje(null);
                Swal.fire(
                    'Creado',
                    'Producto Creado correctamente',
                    'success'
                );
                router.push('/productos');
               // }, 3000);
            } catch(error) {
                guardarMensaje(error.message.replace('GraphQL error:','').replace('Error:',''));
                setTimeout(()=>{
                    guardarMensaje(null);
                }, 3000);
            }
        }
    });

    const mostrarMensaje = ()=>{
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        );
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Producto</h1>
            {mensaje && mostrarMensaje()}
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form onSubmit={formik.handleSubmit}
                        className="bg-white shado-md px-8 pt-6 pb-8 mb-4"
                    >
                        <div className="bmb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                Nombre
                            </label>
                            <input id="nombre" type="text" placeholder="Nombre de Cliente"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.nombre}
                            />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.nombre}</p>
                                </div>
                        ): ''}
                        <div className="bmb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                Precio
                            </label>
                            <input id="precio" type="number" placeholder="Precio de Producto"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.precio}
                            />
                        </div>
                        {formik.touched.precio && formik.errors.precio ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.precio}</p>
                                </div>
                        ): ''}   
                        <div className="bmb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
                                Cantidad Disponible
                            </label>
                            <input id="existencia" type="number" placeholder="Cantidad Disponible"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.existencia}
                            />
                        </div>
                        {formik.touched.existencia && formik.errors.existencia ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.existencia}</p>
                                </div>
                        ): ''}     
                       
                        <input type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Guardar Nuevo Producto"/>
                    </form>
                </div>
            </div>
        
        
        </Layout>
    );
}
export default NuevoProducto;