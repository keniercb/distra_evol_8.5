<?php
class ConceptosModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    //Función para diseñar otros conceptos de persona
    public function getConceptos()
    {
        try {
            $menu = array(
                array('id' => 'cpt01', 'text' => 'Direcciones',
                      'idpadre' => 'cpt01', 'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt02', 'text' => 'Documentos de identidad',
                      'idpadre' => 'cpt02',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt06', 'text' => 'Datos de contacto',
                    'idpadre' => 'cpt06', 'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt07', 'text' => 'Nacionalidades',
                    'idpadre' => 'cpt07',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt08', 'text' => 'Ciudadanías',
                    'idpadre' => 'cpt08',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt09', 'text' => 'Idiomas',
                    'idpadre' => 'cpt09',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt10', 'text' => 'Trayectoria laboral',
                    'idpadre' => 'cpt10',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt11', 'text' => 'Ocupación',
                    'idpadre' => 'cpt11',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt12', 'text' => 'Cuenta bancaria',
                    'idpadre' => 'cpt12',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt13', 'text' => 'Datos de tallaje',
                    'idpadre' => 'cpt13',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt14', 'text' => 'Asignación de medios',
                    'idpadre' => 'cpt14',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt15', 'text' => 'Ingresos personales',
                    'idpadre' => 'cpt15',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt16', 'text' => 'Observaciones',
                    'idpadre' => 'cpt16',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt17', 'text' => 'Situación en la defensa',
                    'idpadre' => 'cpt17',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt18', 'text' => 'Situaciones excepcionales',
                    'idpadre' => 'cpt18',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt19', 'text' => 'Sanciones',
                    'idpadre' => 'cpt19',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt20', 'text' => 'Condecoraciones',
                    'idpadre' => 'cpt20',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt21', 'text' => 'Estudios concluidos',
                    'idpadre' => 'cpt21',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt22', 'text' => 'Nivel educacional',
                    'idpadre' => 'cpt22',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt23', 'text' => 'Categorías científicas',
                    'idpadre' => 'cpt23',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt24', 'text' => 'Afiliaciones',
                    'idpadre' => 'cpt24',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt25', 'text' => 'Familiares y amigos',
                    'idpadre' => 'cpt25',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt26', 'text' => 'Reserva', 'idpadre' => 'cpt26', 'iconCls' => '',
                    'leaf' => true),
                array('id' => 'cpt04', 'text' => 'Pie de firma para contratos',
                    'idpadre' => 'cpt04',  'iconCls' => '', 'leaf' => true),
                array('id' => 'cpt05', 'text' => 'Funciones del cargo',
                    'idpadre' => 'cpt05',  'iconCls' => '', 'leaf' => true)

            );
            $sql = "SELECT idconceptosalarial, denominacion
                    FROM mod_fuerzatrabajo.nom_conceptosalarial;";
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $rCS = $conn->fetchAll($sql);
            if(!empty($rCS)){
                $hijos = array();
                foreach ($rCS as $c){
                    $hijos[] = array('id' => 'cpt03-'.$c['idconceptosalarial'], 'text' => $c['denominacion'],
                    'idpadre' => 'cpt03',  'iconCls' => '', 'leaf' => true);
                }
                $hijos[] = array('id' => 'cpt03-total', 'text' => 'Total',
                    'idpadre' => 'cpt03',  'iconCls' => '', 'leaf' => true);
                $menu[] = array('id' => 'cpt03', 'text' => 'Elementos salariales',
                    'idpadre' => 'cpt03',  'iconCls' => '', 'leaf' => false, 'expanded' => true, 'children' => $hijos);
            }else{
                $menu[] = array('id' => 'cpt03', 'text' => 'Elementos salariales',
                    'idpadre' => 'cpt03',  'iconCls' => '', 'leaf' => true);
            }
            return $menu;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDatosOtrosConceptos($contenido, $idpersona)
    {
        $contenido = ConceptosModel::htmlDirecciones($contenido, $idpersona);
        $contenido = ConceptosModel::htmlDocIdent($contenido, $idpersona);
        $contenido = ConceptosModel::htmlDatosContacto($contenido, $idpersona);
        $contenido = ConceptosModel::htmlNacionalidades($contenido, $idpersona);
        $contenido = ConceptosModel::htmlCiudadanias($contenido, $idpersona);
        $contenido = ConceptosModel::htmlIdiomas($contenido, $idpersona);
        $contenido = ConceptosModel::htmlTrayectoria($contenido, $idpersona);
        $contenido = ConceptosModel::htmlOcupacion($contenido, $idpersona);
        $contenido = ConceptosModel::htmlCuentaBancaria($contenido, $idpersona);
        $contenido = ConceptosModel::htmlTallaje($contenido, $idpersona);
        $contenido = ConceptosModel::htmlMedio($contenido, $idpersona);
        $contenido = ConceptosModel::htmlIngresos($contenido, $idpersona);
        $contenido = ConceptosModel::htmlObservaciones($contenido, $idpersona);
        $contenido = ConceptosModel::htmlSitDef($contenido, $idpersona);
        $contenido = ConceptosModel::htmlSitExcep($contenido, $idpersona);
        $contenido = ConceptosModel::htmlSanciones($contenido, $idpersona);
        $contenido = ConceptosModel::htmlCondecoraciones($contenido, $idpersona);
        $contenido = ConceptosModel::htmlEstudiosConc($contenido, $idpersona);
        $contenido = ConceptosModel::htmlNivelEduc($contenido, $idpersona);
        $contenido = ConceptosModel::htmlCategoriaCient($contenido, $idpersona);
        $contenido = ConceptosModel::htmlAfiliaciones($contenido, $idpersona);
        $contenido = ConceptosModel::htmlFamiliares($contenido, $idpersona);
        $contenido = ConceptosModel::htmlReserva($contenido, $idpersona);

        $contenido = ConceptosModel::htmlFuncionesCargo($contenido, $idpersona);
        $contenido = ConceptosModel::htmlElementosSal($contenido, $idpersona);
        $contenido = ConceptosModel::htmlPieFirma($contenido, $idpersona);
        return $contenido;
    }

    private function htmlDirecciones($contenido, $idpersona)
    {
        /*** Concepto Direcciones ***/
        $estadirLista = explode('<span class="cpt01-1">{Direcciones}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt01-2">{Direcciones}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->getDireccionesByPersona(array($idpersona), null, null, null);
            if (count($datos->data)>0) {
                if (count($estadirLista)>1) {
                    $dirLista = ConceptosModel::organizarDirListado($datos->data);
                    $html = ConceptosModel::getHtmlListado($dirLista);
                    $contenido = str_replace('<span class="cpt01-1">{Direcciones}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dirTabla = ConceptosModel::organizarDirTabla($datos->data);
                    $html = ConceptosModel::getHtmlTabla(array('Dirección', 'Municipio', 'Provincia'), $dirTabla);
                    $contenido = str_replace('<span class="cpt01-2">{Direcciones}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt01-1">{Direcciones}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt01-2">{Direcciones}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlDocIdent($contenido, $idpersona)
    {
        /*** Concepto Documentos de identidad ***/
        $estaDocLista = explode('<span class="cpt02-1">{Documentos de identidad}</span>', $contenido);
        $estaDocTabla = explode('<span class="cpt02-2">{Documentos de identidad}</span>', $contenido);
        if (count($estaDocLista)>1 || count($estaDocTabla)>1) {
            $datosDocIden = ZendExt_IoC_Inter::getInstance()->persona->getDocIdentidadByPersona(array($idpersona), null, null, null);
            if (count($datosDocIden->data)>0) {
                if (count($estaDocLista)>1) {
                    $dirLista = ConceptosModel::organizarDocIdentListado($datosDocIden->data);
                    $html = ConceptosModel::getHtmlListado($dirLista);
                    $contenido = str_replace('<span class="cpt02-1">{Documentos de identidad}</span>', $html, $contenido);
                }
                if (count($estaDocTabla)>1) {
                    $dirTabla = ConceptosModel::organizarDocIdentTabla($datosDocIden->data);
                    $html = ConceptosModel::getHtmlTabla(array('Tipo de documento de identidad', 'Número'), $dirTabla);
                    $contenido = str_replace('<span class="cpt02-2">{Documentos de identidad}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt02-1">{Documentos de identidad}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt02-2">{Documentos de identidad}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlDatosContacto($contenido, $idpersona)
    {
        /*** Concepto Datos de contacto***/
        $estaDocLista = explode('<span class="cpt06-1">{Datos de contacto}</span>', $contenido);
        $estaDocTabla = explode('<span class="cpt06-2">{Datos de contacto}</span>', $contenido);
        if (count($estaDocLista)>1 || count($estaDocTabla)>1) {
            $datosDat = ZendExt_IoC_Inter::getInstance()->pvd->obtenerDatosContacto(array($idpersona));
            if (count($datosDat->data)>0) {
                if (count($estaDocLista)>1) {
                    $dLista = ConceptosModel::organizarDatContListado($datosDat->data);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt06-1">{Datos de contacto}</span>', $html, $contenido);
                }
                if (count($estaDocTabla)>1) {
                    $dTabla = ConceptosModel::organizarDatContTabla($datosDat->data);
                    $html = ConceptosModel::getHtmlTabla(array('Medio de contacto', 'Contacto'), $dTabla);
                    $contenido = str_replace('<span class="cpt06-2">{Datos de contacto}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt06-1">{Datos de contacto}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt06-2">{Datos de contacto}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlNacionalidades($contenido, $idpersona)
    {
        /*** Concepto Nacionalidades ***/
        $estadirLista = explode('<span class="cpt07-1">{Nacionalidades}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt07-2">{Nacionalidades}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->obtenerNacionalidades($idpersona);
            if (count($datos->data)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarNacListado($datos->data);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt07-1">{Nacionalidades}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarNacTabla($datos->data);
                    $html = ConceptosModel::getHtmlTabla(array('Nacionalidad', 'Desde', 'Hasta'), $dTabla);
                    $contenido = str_replace('<span class="cpt07-2">{Nacionalidades}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt07-1">{Nacionalidades}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt07-2">{Nacionalidades}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlCiudadanias($contenido, $idpersona)
    {
        /*** Concepto Ciudadanias ***/
        $estadirLista = explode('<span class="cpt08-1">{Ciudadan&iacute;as}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt08-2">{Ciudadan&iacute;as}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->obtenerCiudadanias(array($idpersona));
            if (count($datos->data)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarCiudListado($datos->data);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt08-1">{Ciudadan&iacute;as}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarCiudTabla($datos->data);
                    $html = ConceptosModel::getHtmlTabla(array('Ciudadanía', 'Desde', 'Hasta'), $dTabla);
                    $contenido = str_replace('<span class="cpt08-2">{Ciudadan&iacute;as}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt08-1">{Ciudadan&iacute;as}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt08-2">{Ciudadan&iacute;as}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlIdiomas($contenido, $idpersona)
    {
        /*** Concepto Idiomas ***/
        $estadirLista = explode('<span class="cpt09-1">{Idiomas}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt09-2">{Idiomas}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->obtenerIdiomas($idpersona);
            if (count($datos)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarIdListado($datos);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt09-1">{Idiomas}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarIdTabla($datos);
                    $html = ConceptosModel::getHtmlTabla(array('Idioma', 'Vía de aprendizaje'), $dTabla);
                    $contenido = str_replace('<span class="cpt09-2">{Idiomas}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt09-1">{Idiomas}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt09-2">{Idiomas}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlTrayectoria($contenido, $idpersona)
    {
        /*** Concepto Trayectoria ***/
        $estadirLista = explode('<span class="cpt10-1">{Trayectoria laboral}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt10-2">{Trayectoria laboral}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->getTrayectoriaLaboralByPersona($idpersona);
            if (count($datos->data)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarTrayListado($datos->data);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt10-1">{Trayectoria laboral}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarTrayTabla($datos->data);
                    $html = ConceptosModel::getHtmlTablaTrayectoriaFicha($dTabla);
                    $contenido = str_replace('<span class="cpt10-2">{Trayectoria laboral}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt10-1">{Trayectoria laboral}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt10-2">{Trayectoria laboral}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlOcupacion($contenido, $idpersona)
    {
        /*** Concepto Ocupación ***/
        $estadirLista = explode('<span class="cpt11-1">{Ocupaci&oacute;n}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt11-2">{Ocupaci&oacute;n}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ConfPlantilladocrec::getSituacionLabPorPersonaEntidad($idpersona);
            if (count($datos)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarOcupListado($datos);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt11-1">{Ocupaci&oacute;n}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarOcupTabla($datos);
                    $html = ConceptosModel::getHtmlTabla(array('Entidad', 'Área', 'Cargo', 'Desde', 'Hasta'), $dTabla);
                    $contenido = str_replace('<span class="cpt11-2">{Ocupaci&oacute;n}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt11-1">{Ocupaci&oacute;n}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt11-2">{Ocupaci&oacute;n}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlCuentaBancaria($contenido, $idpersona)
    {
        /*** Concepto Cuenta bancaria ***/
        $estadirLista = explode('<span class="cpt12-1">{Cuenta bancaria}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt12-2">{Cuenta bancaria}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->getCuentaBancaria(array($idpersona));
            if (count($datos->data)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarCBListado($datos->data);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt12-1">{Cuenta bancaria}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarCBTabla($datos->data);
                    $html = ConceptosModel::getHtmlTabla(array('Número de cuenta', 'Tipo de cuenta', 'Banco', 'Moneda'), $dTabla);
                    $contenido = str_replace('<span class="cpt12-2">{Cuenta bancaria}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt12-1">{Cuenta bancaria}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt12-2">{Cuenta bancaria}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlTallaje($contenido, $idpersona)
    {
        /*** Concepto Tallaje ***/
        $estadirLista = explode('<span class="cpt13-1">{Datos de tallaje}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt13-2">{Datos de tallaje}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->getTallajesByPersona(array($idpersona));
            if (count($datos->data)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarTallListado($datos->data);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt13-1">{Datos de tallaje}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarTallTabla($datos->data);
                    $html = ConceptosModel::getHtmlTabla(array('Prenda', 'Norma', 'Talla'), $dTabla);
                    $contenido = str_replace('<span class="cpt13-2">{Datos de tallaje}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt13-1">{Datos de tallaje}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt13-2">{Datos de tallaje}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlMedio($contenido, $idpersona)
    {
        /*** Concepto Medios ***/
        $estadirLista = explode('<span class="cpt14-1">{Asignaci&oacute;n de medios}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt14-2">{Asignaci&oacute;n de medios}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->getMediosByPerson(array($idpersona));
            if (count($datos->data)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarMedListado($datos->data);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt14-1">{Asignaci&oacute;n de medios}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarMedTabla($datos->data);
                    $html = ConceptosModel::getHtmlTabla(array('Medio', 'Asignación', 'Serie'), $dTabla);
                    $contenido = str_replace('<span class="cpt14-2">{Asignaci&oacute;n de medios}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt14-1">{Asignaci&oacute;n de medios}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt14-2">{Asignaci&oacute;n de medios}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlIngresos($contenido, $idpersona)
    {
        /*** Concepto Ingresos ***/
        $estadirLista = explode('<span class="cpt15-1">{Ingresos personales}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt15-2">{Ingresos personales}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->obtenerIngresoPorPersona($idpersona);
            if (count($datos->data)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarIngListado($datos->data);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt15-1">{Ingresos personales}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarIngTabla($datos->data);
                    $html = ConceptosModel::getHtmlTabla(array('Tipo de ingreso', 'Cuantía', 'Moneda'), $dTabla);
                    $contenido = str_replace('<span class="cpt15-2">{Ingresos personales}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt15-1">{Ingresos personales}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt15-2">{Ingresos personales}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlObservaciones($contenido, $idpersona)
    {
        /*** Concepto Observaciones ***/
        $estadirLista = explode('<span class="cpt16-1">{Observaciones}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt16-2">{Observaciones}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->getObservacion($idpersona);
            if (count($datos->data)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarObsListado($datos->data);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt16-1">{Observaciones}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarObsTabla($datos->data);
                    $html = ConceptosModel::getHtmlTabla(array('Observación'), $dTabla);
                    $contenido = str_replace('<span class="cpt16-2">{Observaciones}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt16-1">{Observaciones}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt16-2">{Observaciones}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlSitDef($contenido, $idpersona)
    {
        /*** Concepto Situación en la defensa ***/
        $estadirLista = explode('<span class="cpt17-1">{Situaci&oacute;n en la defensa}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt17-2">{Situaci&oacute;n en la defensa}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->getSitDefensaByPersona(array($idpersona));
            if (count($datos->data)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarSDListado($datos->data);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt17-1">{Situaci&oacute;n en la defensa}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarSDTabla($datos->data);
                    $html = ConceptosModel::getHtmlTabla(array('Asignación en la defensa', 'Cargo', 'Desde', 'Hasta'), $dTabla);
                    $contenido = str_replace('<span class="cpt17-2">{Situaci&oacute;n en la defensa}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt17-1">{Situaci&oacute;n en la defensa}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt17-2">{Situaci&oacute;n en la defensa}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlSitExcep($contenido, $idpersona)
    {
        /*** Situaciones excepcionales ***/
        $estadirLista = explode('<span class="cpt18-1">{Situaciones excepcionales}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt18-2">{Situaciones excepcionales}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->getSituacExcep(array($idpersona));
            if (count($datos->data)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarSEListado($datos->data);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt18-1">{Situaciones excepcionales}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarSETabla($datos->data);
                    $html = ConceptosModel::getHtmlTabla(array('Estructura', 'Cargo', 'Desde', 'Hasta'), $dTabla);
                    $contenido = str_replace('<span class="cpt18-2">{Situaciones excepcionales}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt18-1">{Situaciones excepcionales}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt18-2">{Situaciones excepcionales}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlSanciones($contenido, $idpersona)
    {
        /*** Sanciones ***/
        $estadirLista = explode('<span class="cpt19-1">{Sanciones}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt19-2">{Sanciones}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->getSancionesByPersona(array($idpersona));
            if (count($datos)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarSanListado($datos);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt19-1">{Sanciones}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarSanTabla($datos);
                    $html = ConceptosModel::getHtmlTabla(array('Sanción', 'Motivo', 'Fecha de imposición'), $dTabla);
                    $contenido = str_replace('<span class="cpt19-2">{Sanciones}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt19-1">{Sanciones}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt19-2">{Sanciones}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlCondecoraciones($contenido, $idpersona)
    {
        /*** Condecoraciones ***/
        $estadirLista = explode('<span class="cpt20-1">{Condecoraciones}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt20-2">{Condecoraciones}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->getCondecoracionesByPersona(array($idpersona));
            if (count($datos)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarCondListado($datos);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt20-1">{Condecoraciones}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarCondTabla($datos);
                    $html = ConceptosModel::getHtmlTabla(array('Condecoración', 'Motivo', 'Fecha'), $dTabla);
                    $contenido = str_replace('<span class="cpt20-2">{Condecoraciones}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt20-1">{Condecoraciones}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt20-2">{Condecoraciones}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlEstudiosConc($contenido, $idpersona)
    {
        /*** Estudios concluidos ***/
        $estadirLista = explode('<span class="cpt21-1">{Estudios concluidos}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt21-2">{Estudios concluidos}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->getEducacionByPersona(array($idpersona));
            if (count($datos)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarEstConcListado($datos);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt21-1">{Estudios concluidos}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarEstConTabla($datos);
                    $html = ConceptosModel::getHtmlTabla(array('Centro de estudio', 'Tipo de formación', 'Curso', 'Desde', 'Hasta'), $dTabla);
                    $contenido = str_replace('<span class="cpt21-2">{Estudios concluidos}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt21-1">{Estudios concluidos}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt21-2">{Estudios concluidos}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlNivelEduc($contenido, $idpersona)
    {
        /*** Nivel educacional ***/
        $estadirLista = explode('<span class="cpt22-1">{Nivel educacional}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt22-2">{Nivel educacional}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->getNivelEduByPersona($idpersona);
            if (count($datos)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarNEducListado($datos);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt22-1">{Nivel educacional}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarNEducConTabla($datos);
                    $html = ConceptosModel::getHtmlTabla(array('Nivel educacional', 'Título','Desde'), $dTabla);
                    $contenido = str_replace('<span class="cpt22-2">{Nivel educacional}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt22-1">{Nivel educacional}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt22-2">{Nivel educacional}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlCategoriaCient($contenido, $idpersona)
    {
        /*** Categorías científicas ***/
        $estadirLista = explode('<span class="cpt23-1">{Categor&iacute;as cient&iacute;ficas}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt23-2">{Categor&iacute;as cient&iacute;ficas}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->getCategoriasByPersona(array($idpersona));
            if (count($datos)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarCategCientListado($datos);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt23-1">{Categor&iacute;as cient&iacute;ficas}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarCategCientTabla($datos);
                    $html = ConceptosModel::getHtmlTabla(array('Tipo de categoría', 'Categoría científica', 'Desde','Hasta'), $dTabla);
                    $contenido = str_replace('<span class="cpt23-2">{Categor&iacute;as cient&iacute;ficas}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt23-1">{Categor&iacute;as cient&iacute;ficas}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt23-2">{Categor&iacute;as cient&iacute;ficas}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlAfiliaciones($contenido, $idpersona)
    {
        /*** Afiliaciones ***/
        $estadirLista = explode('<span class="cpt24-1">{Afiliaciones}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt24-2">{Afiliaciones}</span>', $contenido);
        if (count($estadirLista)>1 || count($estadirTabla)>1) {
            $datos = ZendExt_IoC_Inter::getInstance()->persona->getAfiliacionesByPersona(array($idpersona));
            if (count($datos)>0) {
                if (count($estadirLista)>1) {
                    $dLista = ConceptosModel::organizarAfiliacionesListado($datos);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt24-1">{Afiliaciones}</span>', $html, $contenido);
                }
                if (count($estadirTabla)>1) {
                    $dTabla = ConceptosModel::organizarAfiliacionesTabla($datos);
                    $html = ConceptosModel::getHtmlTabla(array('Tipo de organización', 'Organización', 'Desde','Hasta'), $dTabla);
                    $contenido = str_replace('<span class="cpt24-2">{Afiliaciones}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt24-1">{Afiliaciones}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt24-2">{Afiliaciones}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlFamiliares($contenido, $idpersona)
    {
        /*** Familiares ***/
        $estadirLista = explode('<span class="cpt25-1">{Familiares y amigos}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt25-2">{Familiares y amigos}</span>', $contenido);
        if (count($estadirLista) > 1 || count($estadirTabla) > 1) {
            $datos = ConceptosModel::getFamiliares($idpersona);
            if (count($datos) > 0) {
                if (count($estadirLista) > 1) {
                    $dLista = ConceptosModel::organizarFamiliaresListado($datos);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt25-1">{Familiares y amigos}</span>', $html, $contenido);
                }
                if (count($estadirTabla) > 1) {
                    $dTabla = ConceptosModel::organizarFamiliaresTabla($datos);
                    $html = ConceptosModel::getHtmlTabla(
                        array('Nombre y apellidos', 'No. Identidad', 'Parentesco', 'Conviven'), $dTabla
                    );
                    $contenido = str_replace('<span class="cpt25-2">{Familiares y amigos}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt25-1">{Familiares y amigos}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt25-2">{Familiares y amigos}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlReserva($contenido, $idpersona)
    {
        /*** Reserva ***/
        $estadirLista = explode('<span class="cpt26-1">{Reserva}</span>', $contenido);
        $estadirTabla = explode('<span class="cpt26-2">{Reserva}</span>', $contenido);
        if (count($estadirLista) > 1 || count($estadirTabla) > 1) {
            $datos = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getDatosPersonaReserva(array($idpersona));
            if (count($datos) > 0) {
                if (count($estadirLista) > 1) {
                    $dLista = ConceptosModel::organizarReservaListado($datos);
                    $html = ConceptosModel::getHtmlListado($dLista);
                    $contenido = str_replace('<span class="cpt26-1">{Reserva}</span>', $html, $contenido);
                }
                if (count($estadirTabla) > 1) {
                    $dTabla = ConceptosModel::organizarReservaTabla($datos);
                    $html = ConceptosModel::getHtmlTablaReservaFicha($dTabla);
                    $contenido = str_replace('<span class="cpt26-2">{Reserva}</span>', $html, $contenido);
                }
            } else {
                $contenido = str_replace('<span class="cpt26-1">{Reserva}</span>', '', $contenido);
                $contenido = str_replace('<span class="cpt26-2">{Reserva}</span>', '', $contenido);
            }
        }
        return $contenido;
    }

    private function htmlFuncionesCargo($contenido, $idpersona)
    {
        /** Concepto Funciones del cargo */
        $estaFuncCargoLista = explode('<span class="cpt05-1">{Funciones del cargo}</span>', $contenido);
        $estaFuncCargoTabla = explode('<span class="cpt05-2">{Funciones del cargo}</span>', $contenido);
        if (count($estaFuncCargoLista)>1 || count($estaFuncCargoTabla)>1) {
            $funciones = ConceptosModel::getFuncionesCargo($idpersona);
            if (count($funciones[0]) > 0){
                $listaGenerales = ConceptosModel::getHtmlListado($funciones[0]);
                $htmlGenerales = '<p>Funciones generales: <br />'.$listaGenerales.'</p>';
            }
            if (count($funciones[1]) > 0){
                $listaEspecifica = ConceptosModel::getHtmlListado($funciones[1]);
                $htmlEspecifica = '<p>Funciones específicas: <br />'.$listaEspecifica.'</p>';
            }
            $html = $htmlGenerales.'<br />'.$htmlEspecifica;
            if (count($estaFuncCargoTabla)>1) {
                $contenido = str_replace('<span class="cpt05-2">{Funciones del cargo}</span>', $html, $contenido);
            }
            if (count($estaFuncCargoLista)>1) {
                $contenido = str_replace('<span class="cpt05-1">{Funciones del cargo}</span>', $html, $contenido);
            }
        }
        return $contenido;
    }

    private function htmlElementosSal($contenido, $idpersona)
    {
        /*** Concepto Elementos salariales ***/
        $estaElemSalLista = explode('<span class="cpt03-1">{Elementos salariales}</span>', $contenido);
        $estaElemSalTabla = explode('<span class="cpt03-2">{Elementos salariales}</span>', $contenido);
        if (count($estaElemSalLista)>1 || count($estaElemSalTabla)>1) {
            $datos = ConceptosModel::getDatosElemSal($idpersona);
            //$res = ConceptosModel::eliminarRepetidos($datos);
            if (count($datos)>0) {
                if (count($estaElemSalLista)>1) {
                    $ElemSalLista = ConceptosModel::organizarElemSalListado($datos);
                    $html = ConceptosModel::getHtmlListado($ElemSalLista);
                    $contenido = str_replace('<span class="cpt03-1">{Elementos salariales}</span>', $html, $contenido);
                }
                if (count($estaElemSalTabla)>1) {
                    $html = ConceptosModel::getHtmlTabla(array('Concepto salarial', 'Importe'), $datos);
                    $contenido = str_replace('<span class="cpt03-2">{Elementos salariales}</span>', $html, $contenido);
                }
            }
        }
        return $contenido;
    }

    private function htmlPieFirma($contenido, $idpersona)
    {
        /*** Concepto Pie de firma ***/
        $estaFirmaLista = explode('<span class="cpt04-1">{Pie de firma para contratos}</span>', $contenido);
        $estaFirmaTabla = explode('<span class="cpt04-2">{Pie de firma para contratos}</span>', $contenido);
        if (count($estaFirmaLista)>1 || count($estaFirmaTabla)>1) {
            $firmas = ConceptosModel::getDatosFirmas($idpersona);
            if (count($estaFirmaLista)>1) {
                $html = 'Empleador: '.$firmas[0]['empleador'].' _______________________.<br /><br /><br />Empleado: '.$firmas[0]['empleado'].': _______________________.';
                $contenido = str_replace('<span class="cpt04-1">{Pie de firma para contratos}</span>', $html, $contenido);
            }
            if (count($estaFirmaTabla)>1) {
                $html = ConceptosModel::getHtmlTabla(array('Empleador', 'Empleado'), $firmas);
                $contenido = str_replace('<span class="cpt04-2">{Pie de firma para contratos}</span>', $html, $contenido);
            }
        }
        return $contenido;
    }

    private function getFuncionesCargo($idpersona) {
        //Obteniendo identificador del cargo principal de la persona
        $sql = "SELECT
                  dsl.idcargo
                FROM 
                  mod_persona.dat_situacionlaboral AS dsl
                INNER JOIN mod_persona.dat_personaentidad as dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
                WHERE
                  (dsl.estado = 0) AND dsl.principal = 1 AND dpe.idpersona = ".$idpersona;
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $idcargo = $conn->fetchAll($sql);
        $idestructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idcargo[0]['idcargo']);
        $arreglo = array($idestructura[0]->id);
        $arreglo = ConceptosModel::getEstructurasPadres($arreglo, $idestructura[0]->idpadre);
        $funciones = ZendExt_IoC_Inter::getInstance()->maestro->obtenerFuncionesCargo($arreglo);
        $generales = array();
        $especificas = array();
        foreach ($funciones['datos'] as $k => $v) {
            if($v['especifica'] == 0) {
                array_push($generales, $v['denominacion']);
            } else {
                array_push($especificas, $v['denominacion']);
            }
        }
        return array($generales, $especificas);
    }

    private function getFamiliares($idpersona)
    {
        $sql = "SELECT
                  df.*, np.denominacion as parentesco, CASE WHEN df.conviven = 1 THEN 'Si' ELSE 'No' END as conviven
                FROM 
                  mod_personaext.dat_familiar AS df
                INNER JOIN mod_personaext.nom_parentesco as np ON (df.idparentesco = np.idparentesco)
                WHERE df.idpersona = " .$idpersona;
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $dat = $conn->fetchAll($sql);
        return $dat;
    }

    private function getEstructurasPadres($arreglo, $idestructura) {
        $id = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        if($id[0]->idpadre != $id[0]->idfila){
            array_push($arreglo, $id[0]->idfila);
        } else {
            return $arreglo;
        }
        return ConceptosModel::getEstructurasPadres($arreglo, $id[0]->idpadre);
    }

    private function getDatosFirmas($idpersona) {
        $arrFirmas = Array();
        /** Obteniendo firma del empleador */
        //obteniendo entidad
        $identidad = $_SESSION['Zeolides']['entidad']->idestructura;
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql_empleador = "SELECT
                  CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
                       WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL) THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
                       WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL) THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
                       ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
                  END AS nombre
                FROM 
                  mod_rrhhmaestro.conf_firmadocumento AS cfd
                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = cfd.idpersona)
                WHERE
                  cfd.idtipofirma = 5 AND cfd.identidad = ".$identidad;
        $empleador = $conn->fetchAll($sql_empleador);
        /** Obteniendo firma del empleado */
        $sql_empleado = "SELECT
                  CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
                       WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL) THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
                       WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL) THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
                       ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
                  END AS nombre
                FROM 
                  mod_persona.dat_persona AS dp
                WHERE
                  dp.idpersona = ".$idpersona;
        $empleado = $conn->fetchAll($sql_empleado);
        return array(
            array(
                'empleador' => '<br /><br /><p>&nbsp;&nbsp;&nbsp;______________________________&nbsp;&nbsp;&nbsp;</p>'.$empleador[0]['nombre'],
                'empleado' => '<br /><br /><p>&nbsp;&nbsp;&nbsp;______________________________&nbsp;&nbsp;&nbsp;</p>'.$empleado[0]['nombre']
            )
        );
    }

    private function getDatosElemSal($idpersona)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            /* Busco la configuracion de los conceptos que van al reporte */
            $objConfCS = new ConfPlantillafuncionalidad();
            $arrCS = $objConfCS->getConfigAll();

            $arrIdsCS = array();
            foreach ($arrCS as $cs)
            {
                $arrIdsCS[] = $cs['idestructurarmodelonomina'];
            }
            $sql = "SELECT dpe.identidad FROM mod_persona.dat_situacionlaboral AS dsl
                    INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dpe.idpersonaentidad = dsl.idpersonaentidad)
                    WHERE dpe.idpersona = $idpersona AND dsl.principal = 1 AND (dsl.fhasta IS NULL OR dsl.fhasta >= now());";

            $arrE = $conn->fetchAll($sql);
            /* Busco los valores de los elementos salariales de la persona y el cargo que ocupa la persona */
            $objIoC = ZendExt_IoC::getInstance();
            $arrElemSal = $objIoC->pvd->obtenerDatosPagosAdicionalesCargoyPersona($arrE[0]['identidad'], array($idpersona), $arrIdsCS);
            $r = array();
            $total = 0;
            foreach($arrCS as $cs){
                $r[$cs['idconceptosalarial']][0] = $cs['denominacion'];
                $r[$cs['idconceptosalarial']][1] += $arrElemSal[$idpersona][$cs['idestructurarmodelonomina']];
                $total += $arrElemSal[$idpersona][$cs['idestructurarmodelonomina']];
            }
            $r['total'][0] = 'Total';
            $r['total'][1] += $total;
            return $r;
        } catch (Exception $e) {
            return '';
        }
    }

    private function organizarElemSalListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = $d[0].': '.$d[1];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarElemSalTabla(array $datos)
    {
        $result = Array();
        foreach ($datos[1] as $p=>$d) {
            $result[$p][0] = $d['denominacionconcepto'];
            $result[$p][1] = $d['importe'];
        }
        return $result;
    }

    private function eliminarRepetidos($arr)
    {
        $newArr = Array();
        foreach ($arr as $k => $v) {
            if(count($newArr) == 0) {
                array_push($newArr, $v);
            }
            else {
                $control = 'OK';
                foreach ($newArr as $k1 => $v1) {
                    if($v['denominacion'] == $v1['denominacion'])
                        $control = 'NO';
                }
                if ($control == 'OK')
                    array_push($newArr, $v);
            }
        }
        return $newArr;
    }

    private function organizarDirListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = $d['direccion'].', '.$d['denommunic'].', '.$d['denomprov'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarDirTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['direccion'];
            $result[$p][1] = $d['denommunic'];
            $result[$p][2] = $d['denomprov'];
        }
        return $result;
    }

    private function organizarDocIdentListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Tipo de documento de identidad: '.$d['denomtipodocidentidad'].', Número: '.$d['numero'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarDocIdentTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['denomtipodocidentidad'];
            $result[$p][1] = $d['numero'];
        }
        return $result;
    }

    private function organizarDatContListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Medio de contacto: '.$d['denomtipomediocontacto'].', Contacto: '.$d['contacto'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarDatContTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['denomtipomediocontacto'];
            $result[$p][1] = $d['contacto'];
        }
        return $result;
    }

    private function organizarNacListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Nacionalidad: '.$d['denomnacionalidad'].', Desde: '.$d['fdesde'].', Hasta: '.$d['fhasta'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarNacTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['denomnacionalidad'];
            $result[$p][1] = $d['fdesde'];
            $result[$p][2] = $d['fhasta'];
        }
        return $result;
    }

    private function organizarCiudListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Ciudadanía: '.$d['denomciudadania'].', Desde: '.$d['fdesde'].', Hasta: '.$d['fhasta'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarCiudTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['denomciudadania'];
            $result[$p][1] = $d['fdesde'];
            $result[$p][2] = $d['fhasta'];
        }
        return $result;
    }

    private function organizarIdListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Idioma: '.$d['denominacion'].', Vía de aprendizaje: '.$d['denomformaadquirir'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarIdTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['denominacion'];
            $result[$p][1] = $d['denomformaadquirir'];
        }
        return $result;
    }

    private function organizarTrayListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Entidad: '.$d['orgentidad'].', Cargo: '.$d['cargo'].', Desde: '.$d['fdesde'].', Hasta: '.$d['fhasta'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarTrayTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['orgentidad'];
            $result[$p][1] = $d['cargo'];
            $result[$p][2] = $d['fdesde'];
            $result[$p][3] = $d['fhasta'];
        }
        return $result;
    }

    private function organizarOcupListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($d['identidad']);
            $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($d['idarea']);
            $dir = 'Entidad: '.$entidad[0]->denominacion.', Área: '.$area[0]->denominacion.', Cargo: '.$d['denominacion'].', Desde: '.$d['fdesde'].', Hasta: '.$d['fhasta'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarOcupTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($d['identidad']);
            $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($d['idarea']);
            $result[$p][0] = $entidad[0]->denominacion;
            $result[$p][1] = $area[0]->denominacion;
            $result[$p][2] = $d['denominacion'];
            $result[$p][3] = $d['fdesde'];
            $result[$p][4] = $d['fhasta'];
        }
        return $result;
    }

    private function organizarCBListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Número de cuenta: '.$d['numerocuenta'].', Tipo de cuenta: '.$d['denomtipocuentabancaria'].', Banco: '.$d['denombanco'].', Moneda: '.$d['denommoneda'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarCBTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['numerocuenta'];
            $result[$p][1] = $d['denomtipocuentabancaria'];
            $result[$p][2] = $d['denombanco'];
            $result[$p][3] = $d['denommoneda'];
        }
        return $result;
    }

    private function organizarTallListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Prenda: '.$d['denomprenda'].', Norma: '.$d['denomnorma'].', Talla: '.$d['denomtalla'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarTallTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['denomprenda'];
            $result[$p][1] = $d['denomnorma'];
            $result[$p][2] = $d['denomtalla'];
        }
        return $result;
    }

    private function organizarMedListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Medio: '.$d['dmedio'].', Asignación: '.$d['dasignacion'].', Serie: '.$d['serie'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarMedTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['dmedio'];
            $result[$p][1] = $d['dasignacion'];
            $result[$p][2] = $d['serie'];
        }
        return $result;
    }

    private function organizarIngListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Tipo de ingreso: '.$d['tipoingreso'].', Cuantía: '.$d['cuantia'].', Moneda: '.$d['moneda'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarIngTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['tipoingreso'];
            $result[$p][1] = $d['cuantia'];
            $result[$p][2] = $d['moneda'];
        }
        return $result;
    }

    private function organizarObsListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = $d['observacion'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarObsTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['observacion'];
        }
        return $result;
    }

    private function organizarSDListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Situación en la defensa: '.$d['denomasigdefensa'].', Cargo: '.$d['denomcargo'].', Desde: '.$d['fdesde'].', Hasta: '.$d['fhasta'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarSDTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['denomasigdefensa'];
            $result[$p][1] = $d['denomcargo'];
            $result[$p][2] = $d['fdesde'];
            $result[$p][3] = $d['fhasta'];
        }
        return $result;
    }

    private function organizarSEListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Estructura: '.$d['situacexcep'].', Cargo: '.$d['cargoexcep'].', Desde: '.$d['fdesde'].', Hasta: '.$d['fhasta'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarSETabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['situacexcep'];
            $result[$p][1] = $d['cargoexcep'];
            $result[$p][2] = $d['fdesde'];
            $result[$p][3] = $d['fhasta'];
        }
        return $result;
    }

    private function organizarSanListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Sanción: '.$d['denomsancion'].', Motivo: '.$d['denommotivosancion'].', Fecha de imposición: '.$d['fimposicion'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarSanTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['denomsancion'];
            $result[$p][1] = $d['denommotivosancion'];
            $result[$p][2] = $d['fimposicion'];
        }
        return $result;
    }

    private function organizarCondListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Condecoración: '.$d['denomcondecoracion'].', Motivo: '.$d['denommotivocondecoracion'].', Fecha de imposición: '.$d['fecha'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarCondTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['denomcondecoracion'];
            $result[$p][1] = $d['denommotivocondecoracion'];
            $result[$p][2] = $d['fecha'];
        }
        return $result;
    }

    private function organizarEstConcListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Centro de estudio: '.$d['denomcentroestudio'].', Tipo de formación: '.$d['denomtipoformacion'].', Curso: '.$d['curso'].', Desde: '.$d['fdesde'].', Hasta: '.$d['fhasta'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarEstConTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['denomcentroestudio'];
            $result[$p][1] = $d['denomtipoformacion'];
            $result[$p][2] = $d['curso'];
            $result[$p][3] = $d['fdesde'];
            $result[$p][4] = $d['fhasta'];
        }
        return $result;
    }

    private function organizarNEducListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Nivel educacional: '.$d['niveleducacional'].', Título: '.$d['titulo'].', Desde: '.$d['fdesde'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarNEducConTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['niveleducacional'];
            $result[$p][1] = $d['titulo'];
            $result[$p][2] = $d['fdesde'];
        }
        return $result;
    }

    private function organizarCategCientListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Tipo de categoría: '.$d['denomtipocategoria'].', Categoría científica: '.$d['denomcategoria'].', Desde: '.$d['fdesde'].', Hasta: '.$d['fhasta'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarCategCientTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['denomtipocategoria'];
            $result[$p][1] = $d['denomcategoria'];
            $result[$p][2] = $d['fdesde'];
            $result[$p][3] = $d['fhasta'];
        }
        return $result;
    }

    private function organizarAfiliacionesListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $dir = 'Tipo de organización: '.$d['denomtipoorganizacion'].', Organización: '.$d['denomorganizacion'].', Desde: '.$d['fdesde'].', Hasta: '.$d['fhasta'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarAfiliacionesTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p=>$d) {
            $result[$p][0] = $d['denomtipoorganizacion'];
            $result[$p][1] = $d['denomorganizacion'];
            $result[$p][2] = $d['fdesde'];
            $result[$p][3] = $d['fhasta'];
        }
        return $result;
    }

    private function organizarFamiliaresListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p => $d) {
            $dir = 'Nombre y apellidos: ' . $d['nombre'] . ', No. Identidad: ' .
                $d['numid'] . ', Parentesco: ' . $d['parentesco'] . ', Conviven: ' . $d['conviven'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarFamiliaresTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p => $d) {
            $result[$p][0] = $d['nombre'];
            $result[$p][1] = $d['numid'];
            $result[$p][2] = $d['parentesco'];
            $result[$p][3] = $d['conviven'];
        }
        return $result;
    }

    private function organizarReservaListado(array $datos)
    {
        $result = Array();
        foreach ($datos as $p => $d) {
            $dir = 'Entidad: ' . $d['entidad'] . ', Área: ' .
                $d['area'] . ', Cargo: ' . $d['cargo'] . ', Desde: ' . $d['fdesde'].', Hasta: ' . $d['fhasta'];
            array_push($result, $dir);
        }
        return $result;
    }

    private function organizarReservaTabla(array $datos)
    {
        $result = Array();
        foreach ($datos as $p => $d) {
            $result[$p][0] = $d['entidad'].'/'.$d['area'];
            $result[$p][1] = $d['cargo'];
            $result[$p][2] = $d['fdesde'];
            $result[$p][3] = $d['fhasta'];
        }
        return $result;
    }

    private function getHtmlListado(array $listado)
    {
        try {
            $html = '<ol>';
            foreach ($listado as $valor) {
                $html.= "<li>".$valor."</li>";
            }
            $html .= '</ol>';
            return $html;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function getHtmlTabla(array $columnas, array $datos)
    {
        try {
            $html = '';
            if (count($columnas)>0 && count($datos)>0) {
                $html = "<table border='0.5' cellspacing='0'><tr>";
                foreach ($columnas as $colum) {
                    $html.= "<th>".$colum."</th>";
                }
                $html .= '</tr>';
                foreach ($datos as $fila) {
                    $html .= '<tr>';
                    foreach ($fila as $celda) {
                        $html.= "<td>".$celda."</td>";
                    }
                    $html .= '</tr>';
                }
                $html .= '</table>';
            }
            return $html;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function getHtmlTablaTrayectoriaFicha(array $datos)
    {
        try {
            $html = "<table border='0.5' cellspacing='0'><tr><th width='75' align='center'>Desde</th><th width='75' align='center'>Hasta</th><th width='275' align='center'>Cargo</th><th width='275' align='center'>Centro Laboral</th></tr>";
            foreach ($datos as $value) {
                $html .= "<tr><td width='75' align='center'>".$value[2]."</td><td width='75' align='center'>".$value[3]."</td><td width='275'>".$value[1]."</td><td width='275'>".$value[0]."</td></tr>";
            }
            $html .= '</table>';
            return $html;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function getHtmlTablaReservaFicha(array $datos)
    {
        try {
            $html =
                "<table border='0.5' cellspacing='0'><tr><th width='75' align='center'>Desde</th><th width='75' align='center'>Hasta</th><th width='275' align='center'>Cargo</th><th width='275' align='center'>Entidad/Área</th></tr>";
            foreach ($datos as $value) {
                $html .= "<tr><td width='75' align='center'>" . $value[2] . "</td><td width='75' align='center'>" .
                    $value[3] . "</td><td width='275'>" . $value[1] . "</td><td width='275'>" . $value[0] .
                    "</td></tr>";
            }
            $html .= '</table>';
            return $html;
        } catch (Exception $e) {
            throw $e;
        }
    }
}
