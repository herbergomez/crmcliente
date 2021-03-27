import React, {useState} from 'react';
import Layout from '../components/layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import  {useMutation, gql} from '@apollo/client';
import {useRouter} from 'next/router';

const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input:ClienteInput) {
        nuevoCliente(input:$input) {
            nombre
            apellido
        }
    }
`;

const OBTENER_CLIENTES_USUARIO = gql`
    query obtenerClientesVendedor {
        obtenerClientesVendedor {
            id
            nombre
            apellido
            empresa
            email
        }
    }
`;
const NuevoCliente = () =>{
    const router = useRouter();
    //State para el mensaje
    const [mensaje,guardarMensaje]= useState(null);

    const [nuevoCliente] = useMutation(NUEVO_CLIENTE,{
        update(cache,{data:{nuevoCliente}}) {
            //Obtener el objeto de cache que deseamos actualizar
            const {obtenerClientesVendedor}  = cache.readQuery({query:OBTENER_CLIENTES_USUARIO});
            
            //Reescribimos el cache (el cache nunca se debe de modificar)
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data:{
                    obtenerClientesVendedor:[...obtenerClientesVendedor,nuevoCliente ]
                }
            })
        }
    });
    const formik = useFormik({
        initialValues:{
            nombre:'',
            apellido:'',
            empresa:'',
            email:'',
            telefono:''
        },
        validationSchema:Yup.object({
            nombre:Yup.string().required('El nombre es requerido'),
            apellido:Yup.string().required('El apellido es requerido'),
            empresa:Yup.string().required('La empresa es requerida'),
            email:Yup.string().email('El email no es valido').required('El email no puede ir vacio.'),
            telefono:Yup.string()
        }),
        onSubmit:async valores=>{
            const {nombre, apellido,empresa, email,telefono}=valores;
            try {
              const {data} = await nuevoCliente({
                    variables:{
                        input:{
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono
                        }
                    }
               });
              
                guardarMensaje(`Se creo correctamente el cliente: ${data.nuevoCliente.nombre}`);
                setTimeout(()=>{
                    guardarMensaje(null);
                    router.push('/');
                }, 3000);
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
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>
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
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                Apellido
                            </label>
                            <input id="apellido" type="text" placeholder="Apellido de Cliente"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.apellido}
                            />
                        </div>
                        {formik.touched.apellido && formik.errors.apellido ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.apellido}</p>
                                </div>
                        ): ''}   
                        <div className="bmb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                                Empresa
                            </label>
                            <input id="empresa" type="text" placeholder="Empresa de Cliente"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.empresa}
                            />
                        </div>
                        {formik.touched.empresa && formik.errors.empresa ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.empresa}</p>
                                </div>
                        ): ''}     
                        <div className="bmb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input id="email" type="email" placeholder="Email de Cliente"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                        </div>
                        {formik.touched.email && formik.errors.email ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.email}</p>
                                </div>
                        ): ''}     
                        <div className="bmb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                Telefono
                            </label>
                            <input id="telefono" type="tel" placeholder="Telefono de Cliente"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.telefono}
                            />
                        </div>
                        <input type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Registrar Cliente"/>
                    </form>
                </div>
            </div>
        
        
        </Layout>
    );
}

export default NuevoCliente;