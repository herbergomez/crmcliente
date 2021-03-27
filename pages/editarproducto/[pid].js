import React, {useState}  from 'react';
import {useRouter} from 'next/router';
import Layout from '../../components/layout';
import {gql, useQuery, useMutation} from '@apollo/client';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_PRODUCTO = gql`
    query obtenerProductoPorId($id:ID!){
        obtenerProductoPorId(id:$id){
            id
            nombre
            existencia
            precio
        }
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id:ID!,$input:ProductoInput){
        actualizarProducto(id:$id,input:$input){
            id
            nombre
            existencia
            precio
        }
    }
`;

const EditarProducto = () =>{
    //obtener el ID actual
    const router = useRouter();
    //State para el mensaje
    const [mensaje,guardarMensaje]= useState(null);
    
    const {query:{id}} = router;

    //consultar para obtener el cliente
    const{data, loading, error} = useQuery(OBTENER_PRODUCTO,{
        variables:{
            id
        }
    });

    //ActuaLizar producto
    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

    //Schema de validacion
    const schemaValidacion = Yup.object({
        nombre:Yup.string().required('El nombre es requerido'),
        precio:Yup.number().required('El precio es requerido').positive('El precio debe ser mayor o igual a 0'),
        existencia:Yup.number().required('La existencia es requerida').positive('La cantidad disponible debe ser mayor o igual 0').integer('La existencia debe ser un numero entero')
    });

    if(loading) return 'Cargando...';

    if(!data) return 'Accion no permitida';
    
    const {obtenerProductoPorId} = data;


    //modifca el cliente en la BD
    const actualizarInfoProducto = async (valores) =>{
        const {nombre, existencia, precio} = valores;

        try {
            const {data} = await actualizarProducto({
                variables:{
                    id,
                    input:{
                        nombre, 
                        existencia, 
                        precio
                    }
                }
            });
            Swal.fire(
                'Actualizado!',
                'El producto se actualizo correctamente',
                'success'
              )
            router.push('/productos');
        } catch(error){
            guardarMensaje(error.message.replace('GraphQL error:','').replace('Error:',''));
                setTimeout(()=>{
                    guardarMensaje(null);
                }, 3000);
        }
    }
    const mostrarMensaje = ()=>{
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        );
    }

    return (
        <Layout>
             <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>
             {mensaje && mostrarMensaje()}
             <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={schemaValidacion}
                        enableReinitialize
                        initialValues={obtenerProductoPorId}
                        onSubmit={(valores)=>{
                            actualizarInfoProducto(valores);
                        }}
                    >
                        {props =>{
                            return (
                                <form onSubmit={props.handleSubmit}
                                    className="bg-white shado-md px-8 pt-6 pb-8 mb-4"
                                >
                                    <div className="bmb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                            Nombre
                                        </label>
                                        <input id="nombre" type="text" placeholder="Nombre de Producto"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                           onChange={props.handleChange}
                                           onBlur={props.handleBlur}
                                           value={props.values.nombre}
                                        />
                                    </div>
                                    {props.touched.nombre && props.errors.nombre ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.nombre}</p>
                                            </div>
                                    ): ''}
                                    <div className="bmb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                            Precio
                                        </label>
                                        <input id="precio" type="number" placeholder="Precio de Producto"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.precio}
                                        />
                                    </div>
                                    { props.touched.precio && props.errors.precio ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.precio}</p>
                                            </div>
                                    ): ''}   
                                    <div className="bmb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
                                            Cantidad Disponible
                                        </label>
                                        <input id="existencia" type="number" placeholder="Existencia de Producto"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.existencia}
                                        />
                                    </div>
                                    {props.touched.existencia && props.errors.existencia ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.existencia}</p>
                                            </div>
                                    ): '' }     
                                   
                                    <input type="submit"
                                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                            value="Guardar Producto"/>
                                </form>
                            )
                        }}
                        
                    </Formik>
                    
                </div>
            </div>
        </Layout>
    )
}

export default EditarProducto;