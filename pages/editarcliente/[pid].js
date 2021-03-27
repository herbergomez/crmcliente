import React, {useState}  from "react";
import {useRouter} from 'next/router';
import Layout from '../../components/layout';
import {gql, useQuery, useMutation} from '@apollo/client';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_CLIENTE = gql`
    query obtenerClientePorId($id:ID!){
        obtenerClientePorId(id:$id){
            id
            nombre
            apellido
            empresa
            email
            telefono
            vendedor
        }
    }
`;

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id:ID!,$input:ClienteInput){
        actualizarCliente(id:$id,input:$input){
            id
            nombre
            apellido
            empresa
        }
    }
`;

const EditarCliente = () =>{
    //obtener el ID actual
    const router = useRouter();
    //State para el mensaje
    const [mensaje,guardarMensaje]= useState(null);
    
    const {query:{id}} = router;

    //consultar para obtener el cliente
    const{data, loading, error} = useQuery(OBTENER_CLIENTE,{
        variables:{
            id
        }
    });

    //ActuaLizar cliente
    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

    //Schema de validacion
    const schemaValidacion = Yup.object({
        nombre:Yup.string().required('El nombre es requerido'),
        apellido:Yup.string().required('El apellido es requerido'),
        empresa:Yup.string().required('La empresa es requerida'),
        email:Yup.string().email('El email no es valido').required('El email no puede ir vacio.'),
        telefono:Yup.string()
    });

    if(loading) return 'Cargando...';

    if(!data) return 'Accion no permitida';
    
    const {obtenerClientePorId} = data;


    //modifca el cliente en la BD
    const actualizarInfoCliente = async (valores) =>{
        const {nombre, apellido, empresa, email, telefono} = valores;
        try {
            const {data} = await actualizarCliente({
                variables:{
                    id,
                    input:{
                        nombre, 
                        apellido, 
                        empresa, 
                        email, 
                        telefono
                    }
                }
            });
            Swal.fire(
                'Actualizado!',
                'El cliente se actualizo correctamente',
                'success'
              )
            router.push('/');
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
             <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>
             {mensaje && mostrarMensaje()}
             <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={schemaValidacion}
                        enableReinitialize
                        initialValues={obtenerClientePorId}
                        onSubmit={(valores)=>{
                            actualizarInfoCliente(valores);
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
                                        <input id="nombre" type="text" placeholder="Nombre de Cliente"
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
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                            Apellido
                                        </label>
                                        <input id="apellido" type="text" placeholder="Apellido de Cliente"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.apellido}
                                        />
                                    </div>
                                    { props.touched.apellido && props.errors.apellido ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.apellido}</p>
                                            </div>
                                    ): ''}   
                                    <div className="bmb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                                            Empresa
                                        </label>
                                        <input id="empresa" type="text" placeholder="Empresa de Cliente"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.empresa}
                                        />
                                    </div>
                                    {props.touched.empresa && props.errors.empresa ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.empresa}</p>
                                            </div>
                                    ): '' }     
                                    <div className="bmb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                            Email
                                        </label>
                                        <input id="email" type="email" placeholder="Email de Cliente"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.email}
                                            
                                        />
                                    </div>
                                    { props.touched.email && props.errors.email ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.email}</p>
                                            </div>
                                    ): ''  }    
                                    <div className="bmb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                            Telefono
                                        </label>
                                        <input id="telefono" type="tel" placeholder="Telefono de Cliente"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.telefono}
                                            
                                        />
                                    </div>
                                    <input type="submit"
                                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                            value="Guardar Cliente"/>
                                </form>
                            )
                        }}
                        
                    </Formik>
                    
                </div>
            </div>
        </Layout>
    );
}
export default EditarCliente;