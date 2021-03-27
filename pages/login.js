import React,{useState} from 'react';
import  {useMutation, gql} from '@apollo/client';
import {useRouter} from 'next/router';
import Layout from '../components/layout'
import {useFormik} from 'formik';
import * as Yup from 'yup';


const LOGUEAR_USUARIO = gql`
    mutation autenticarUsuario($input:AutenticarInput) {
        autenticarUsuario(input:$input) {
            token
        }
    }
`;

const Login = ()=>{
    //State para el mensaje
    const [mensaje,guardarMensaje]= useState(null);

    //Mutation para crear loguear usuarios
    const [autenticarUsuario] = useMutation(LOGUEAR_USUARIO);

    //Routing
    const router = useRouter();

    const formik = useFormik({
        initialValues:{
            email:'',
            password:''
        },
        validationSchema: Yup.object({
            email:Yup.string().email('El email no es valido').required('El email no puede ir vacio.'),
            password:Yup.string().required('La password no puede ir vacia.')
        }),
        onSubmit: async valores=>{
            //console.log(valores);
            const {email,password}=valores;
            try {
              const {data} = await autenticarUsuario({
                    variables:{
                        input:{
                            email,
                            password
                        }
                    }
               });
                
                guardarMensaje('Autenticando...');
               
                //Guardar el token en el localStorage
                setTimeout(() => {
                    const {token} = data.autenticarUsuario;
                    localStorage.setItem('token', token);
                }, 1000);
                
                setTimeout(()=>{
                    guardarMensaje(null);
                     //Redireccionar hacia clientes
                    return router.push('/');
                }, 1500);
               
                
            } catch(error) {
                guardarMensaje(error.message.replace('GraphQL error:',''));
                
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
        <>
            <Layout>
                {mensaje && mostrarMensaje()}

                <h1 className="text-center text-2xl text-white font-light">Login</h1>

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={formik.handleSubmit}>
                            <div className="bmb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input id="email" type="email" placeholder="Email de Usuario"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input id="password" type="password" placeholder="Password de Usuario"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.password}</p>
                                </div>
                            ): ''}       
                            <input type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Iniciar Sesion"/>
                        </form>
                    </div>
                </div>
           </Layout>
            
        </>
    );
}

export default Login;