import React from 'react'
import Header from './Header'
import {Global, css} from '@emotion/react'
import Head from 'next/head'

const Layout = props => {
  return (
    <>
        <Global
            styles={css`
                :root{
                    --gris: #3d3d3d;
                    --gris2: #6f6f6f;
                    --gris3: #e1e1e1;
                    --naranja: #DA552F;
                }
                html {
                    font-size: 62.5%;
                    box-sizing: border-box;
                }
                *, *:before, *:after {
                    box-sizing: inherit;
                }
                body {
                    font-size: 1.6rem;
                    line-height: 1.5;
                    font-family: Arial, Helvetica, sans-serif;
                }
                h1, h2, h3 {
                    margin: 0 0 2rem 0;
                    line-height: 1.5;
                }

                h1, h2 {
                    font-family: 'Roboto Slab', serif;
                    font-weight: 700;
                }
                h3 {
                    font-family: Arial, Helvetica, sans-serif;
                }

                ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;     
                }
                a {
                    text-decoration: none;
                }

                img {
                    max-width: 100%;
                }
            `}
        />

        <Head>
            <title>Product Hunt Firebase y Next.js</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" 
            integrity="sha512-oHDEc8Xed4hiW6CxD7qjbnI+B07vDdX7hEPTvn9pSZO1bcRqHp8mj9pyr+8RVC2GmtEfI2Bi9Ke9Ass0as+zpg==" 
            crossOrigin="anonymous" referrerPolicy="no-referrer" />
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymus"/>
            <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet"/>
        </Head>

        <Header/>

        <main>
        {props.children}
        </main>
    </>
  )
}

export default Layout
