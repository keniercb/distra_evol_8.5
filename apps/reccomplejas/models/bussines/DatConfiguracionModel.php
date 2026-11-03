<?php

class DatConfiguracionModel extends ZendExt_Model
{

    public function DatConfiguracionModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Genera los XML y JSON de configuracion necesarios para el recuperador complejo
     *
     * @author Ing. Javier Rodriguez Lopez
     *
     * @param $idconfiguracion
     * @param $idtablabase
     *
     * @throws Zend_ExtException
     */
    public function generarXML($idconfiguracion, $idtablabase)
    {
        $objDatCampo = new DatCampo();
        $objSegCampo = new SegCampo();
        $objSegFiltro = new SegFiltro();
        $objXML = new ReadXmlRec($idconfiguracion);
        $arrLog = array();

        //Obtengo la dirección donde voy a guardar los ficheros Json.
        $register = Zend_Registry::getInstance();
        $dirFilesJson = $register->config->modulo_path .
            'comun/recursos/config_reccomplejas/config_' . $idconfiguracion . '/json/';

        //Direccion del fichero de compartimentacion
        $dirFileComp = $register->config->modulo_path .
            'comun/recursos/config_reccomplejas/config_' . $idconfiguracion . '/compartimentacion.php';

        if (!file_exists($dirFilesJson)) {
            if (!mkdir($dirFilesJson, 0777, true)) {
                throw new Zend_ExtException('ADMINREC02'); //Fallo al crear carpeta
            }
        }

        $selectores = array();
        $hiddenFields = array();

        //Obtiene todos los campos configurados
        $arrCampos = $objDatCampo->getCamposConfiguracion($idconfiguracion, 0);
		

        //Se extraen los campos que son ocultos del arbol
        foreach ($arrCampos as $campo) {
            if ($campo['oculto']) {
                $hiddenFields[] = $campo;
            } else {
                $selectores[] = $campo;
            }
        }

        //Genera el JSON de llaves primarias
        $objJson = json_encode($idtablabase);
        file_put_contents($dirFilesJson . 'pkeys.json', $objJson);
        $arrLog[] = 'Archivo pkeys.json generado correctamente.';

        //Genera el JSON de selectores
        $arbolCampos = $this->crearArbol($selectores);
        $objJson = json_encode($arbolCampos);
        file_put_contents($dirFilesJson . 'campos.json', $objJson);
        $arrLog[] = 'Archivo campos.json generado correctamente.';

        //Genera el JSON de campos ocultos
        $objJson = json_encode($hiddenFields);
        file_put_contents($dirFilesJson . 'hiddenFields.json', $objJson);
        $arrLog[] = 'Archivo hiddenFields.json generado correctamente.';

        //Genera XML de configuracion_mostrar
        $arrConfMostrar = $objDatCampo->getArrConfigMostrar($idconfiguracion);
        $objXML->generarXML($arrConfMostrar, 'configuracion_mostrar');
        $arrLog[] = 'Archivo configuracion_mostrar.xml generado correctamente.';

        //Genera XML de configuracion_condicion
        $arrConfCondicion = $objDatCampo->getArrConfigCondicion($idconfiguracion);
        $objXML->generarXML($arrConfCondicion, 'configuracion_condicion');
        $arrLog[] = 'Archivo configuracion_condicion.xml generado correctamente.';

        //Genera el XML de mapeo
        $arrMapeo = $objDatCampo->getMapeoConfiguracion($idconfiguracion);
        $objXML->generaXmlMapeo($arrMapeo);
        $arrLog[] = 'Archivo mapeo.xml generado correctamente.';

        //Genera el XML de los campos multievaluados
        $arrMultiplesValores = $objDatCampo->getMultiplesValores($idconfiguracion);
        $objXML->generaXMLMultievaluado($arrMultiplesValores);
        $arrLog[] = 'Archivo campo_multievaluado.xml generado correctamente.';

        //Genera los XML de compartimentacion
        //XML de filtros por roles
        $arrFilters = $objSegFiltro->getListFilters($idconfiguracion);
        $arrLog[] = $objXML->generateFilters($arrFilters);

        //XML de acceso a los campos por roles
        $arrAccess = $objSegCampo->getListAccess($idconfiguracion);
        $arrLog[] = $objXML->generateAccess($arrAccess);

        //Comprueba que el fichero no exista para no crearlo dos veces
        if (!file_exists($dirFileComp)) {
            $objComp = new CompartimentacionModel($idconfiguracion);
            $objComp->createFileCompartimentacion();
        }
    }

    /**
     * Metodo recursivo que forma el arbol partir de un array
     *
     * @param type $array
     * @param type $idpadre
     *
     * @return type
     */
    private function crearArbol($array, $idpadre = null)
    {
        $arbol = array();
        $j = 0;
        foreach ($array as $key => $nodo) {
            if (empty($idpadre) && empty($nodo['idpadre'])) {
                if (empty($nodo['campo'])) {
                    $nodo['children'] = $this->crearArbol($array, $nodo['idcampo']);
                    $arbol[$j++] = $nodo;
                } else {
                    $arbol[$j++] = $nodo; //Es un campo hoja sin padre.
                }
            } else {
                if ($nodo['idpadre'] == $idpadre) { //Buscando los nodos hijos
                    if (empty($nodo['campo'])) {
                        $nodo['children'] = $this->crearArbol($array, $nodo['idcampo']);
                        $arbol[$j++] = $nodo;
                    } else {
                        $arbol[$j++] = $nodo;
                    }
                }
            }
        }
        return $arbol;
    }


    //FUNCTIONES PRIVADAS

    public function duplicarConfiguracion($idConfigOrigal, $idconfiguracion, $denominacion, $password)
    {

        $objConfigOrignal = Doctrine::getTable('NomConfiguracion')->find($idConfigOrigal);

        if (!empty($password)) {
            $RSA = new ZendExt_RSA();
            $keys = $RSA->generate_keys('9990454949', '9990450271', 0);
            $password = $RSA->encrypt($password, $keys[1], $keys[0], 5);
        }
        try {
            $dcConfig = new NomConfiguracion();
            //Datos de la configuracion
            $dcConfig->idconfiguracion = $idconfiguracion;
            $dcConfig->denominacion = $denominacion;
            $dcConfig->claveproteccion = $password;
            $dcConfig->servidor = $objConfigOrignal->servidor;
            $dcConfig->puerto = $objConfigOrignal->puerto;
            $dcConfig->basedato = $objConfigOrignal->basedato;
            $dcConfig->usuario = $objConfigOrignal->usuario;
            $dcConfig->contrasena = $objConfigOrignal->contrasena;
            $dcConfig->esquema = $objConfigOrignal->esquema;
            $dcConfig->tabla = $objConfigOrignal->tabla;
            $dcConfig->idtablabase = $objConfigOrignal->idtablabase;

            //Datos de los campos
            $i = 0;

            foreach ($objConfigOrignal->DatCampo as $objCampo) {
                //Datos de los campos
                //	$dcConfig->DatCampo[$i]->idpadre = $objCampo->idpadre;
                $dcConfig->DatCampo[$i]->campo = $objCampo->campo;
                $dcConfig->DatCampo[$i]->denominacion = $objCampo->denominacion;
                $dcConfig->DatCampo[$i]->descripcion = $objCampo->descripcion;
                $dcConfig->DatCampo[$i]->esquema = $objCampo->esquema;
                $dcConfig->DatCampo[$i]->tabla = $objCampo->tabla;

                //Datos del campo multievaluado
                foreach ($objCampo->DatMultievaluado as $kme => $objMultiEvaldo) {
                    $dcConfig->DatCampo[$i]->DatMultievaluado[$kme]->valor = $objMultiEvaldo->valor;
                    $dcConfig->DatCampo[$i]->DatMultievaluado[$kme]->denominacion = $objMultiEvaldo->denominacion;
                }
                //Datos del mapeo
                foreach ($objCampo->DatMapeo as $kma => $objMapeo) {
                    $dcConfig->DatCampo[$i]->DatMapeo[$kma]->esquema = $objMapeo->esquema;
                    $dcConfig->DatCampo[$i]->DatMapeo[$kma]->tabla = $objMapeo->tabla;
                    $dcConfig->DatCampo[$i]->DatMapeo[$kma]->persistejoin = $objMapeo->persistejoin;
                    $dcConfig->DatCampo[$i]->DatMapeo[$kma]->idpersistejoin = $objMapeo->idpersistejoin;
                    $dcConfig->DatCampo[$i]->DatMapeo[$kma]->tipoconexion = $objMapeo->tipoconexion;

                   //Datos de la union
                    foreach ($objMapeo->DatUnion as $ku => $objUnion) {
                        $dcConfig->DatCampo[$i]->DatMapeo[$kma]->DatUnion[$ku]->campoinicial = $objUnion->campoinicial;
                        $dcConfig->DatCampo[$i]->DatMapeo[$kma]->DatUnion[$ku]->operador = $objUnion->operador;
                        $dcConfig->DatCampo[$i]->DatMapeo[$kma]->DatUnion[$ku]->campofinal = $objUnion->campofinal;
                        $dcConfig->DatCampo[$i]->DatMapeo[$kma]->DatUnion[$ku]->logico = $objUnion->logico;
                    }
                }
                ++$i;
            }

            $dcConfig->save();

            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();

            $sql = "SELECT mod_reccomplejas2.dat_configmostrar.idconfigmostrar,ca.idcampo,ca.denominacion,
               mod_reccomplejas2.dat_configmostrar.anchocolumna,
               replace(mod_reccomplejas2.dat_configmostrar.sqlselect,'''','''''') as sqlselect,
               mod_reccomplejas2.dat_configmostrar.renderer,mod_reccomplejas2.dat_configmostrar.obligatorio,
               mod_reccomplejas2.dat_configmostrar.expander,mod_reccomplejas2.dat_configmostrar.agruparcampo,
               mod_reccomplejas2.dat_configmostrar.tooltip,mod_reccomplejas2.dat_configmostrar.oculto,
               mod_reccomplejas2.dat_configmostrar.icono
                FROM mod_reccomplejas2.dat_campo as ca
                inner join mod_reccomplejas2.dat_configmostrar on(mod_reccomplejas2.dat_configmostrar.idcampo = ca.idcampo)
                where ca.idconfiguracion ilike '$idConfigOrigal'
                " ;
            $objConfigCampo =  $conn->fetchAll($sql);

            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();

            $sqlid = "SELECT ca.idcampo,ca.idconfiguracion,ca.idpadre,ca.campo,ca.denominacion,ca.descripcion,ca.esquema,ca.tabla,ca.alias
                FROM mod_reccomplejas2.dat_campo as ca
                where ca.idconfiguracion ilike '$idconfiguracion'
                " ;
            $objidCampo =  $conn->fetchAll($sqlid);

            $arrayid = array();
            $contid = 0;
           foreach($objidCampo as $id){
               foreach($objConfigCampo as $idv){
                   if($id['denominacion'] == $idv['denominacion']){
                       $arrayid[$contid]['idcampo'] = $id['idcampo'];
                       $arrayid[$contid]['idcampov'] = $idv['idcampo'];
                       $contid++;
                   }
               }
           }
         /****************************Mostrar las propiedades de los datos******************************/
            foreach ($arrayid as $obj) {
                $idcampoviejo = $obj['idcampov'];
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $sql = "SELECT
               mod_reccomplejas2.dat_configmostrar.anchocolumna,
               replace(mod_reccomplejas2.dat_configmostrar.sqlselect,'''','''''') as sqlselect,
               mod_reccomplejas2.dat_configmostrar.renderer,
               mod_reccomplejas2.dat_configmostrar.obligatorio,
               mod_reccomplejas2.dat_configmostrar.expander,
               mod_reccomplejas2.dat_configmostrar.agruparcampo,
               mod_reccomplejas2.dat_configmostrar.tooltip,
               mod_reccomplejas2.dat_configmostrar.oculto,
               mod_reccomplejas2.dat_configmostrar.icono
                FROM  mod_reccomplejas2.dat_configmostrar
                where mod_reccomplejas2.dat_configmostrar.idcampo = $idcampoviejo " ;
                $objCampo =  $conn->fetchAll($sql);

                //Datos configuracion mostrar
                $idcampo = $obj['idcampo'];
                $anchocolumna = $objCampo[0]['anchocolumna'];
                $obligatorio  = $objCampo[0]['obligatorio'];
                $expander = $objCampo[0]['expander'];
                $agruparcampo = $objCampo[0]['agruparcampo'];
                $tooltip = $objCampo[0]['tooltip'];
                $oculto = $objCampo[0]['oculto'];
                $sqlselect = $objCampo[0]['sqlselect'];
                $renderer = $objCampo[0]['renderer'];
                $icono = $objCampo[0]['icono'];

                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();

                $sqlI = "INSERT INTO mod_reccomplejas2.dat_configmostrar(
                         idcampo,anchocolumna,sqlselect,renderer, obligatorio, expander, agruparcampo,tooltip,
                         oculto,icono)
                        VALUES ($idcampo,$anchocolumna,'$sqlselect','$renderer',$obligatorio, $expander,
                                $agruparcampo,$tooltip , $oculto,'$icono')" ;
                $conn->fetchAll($sqlI);

        }
            /***************************Mostrar las condiciones de los campos*******************/

            foreach ($arrayid as $obj) {
                $idcampoviejo = $obj['idcampov'];
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();

                $sqlC = "SELECT mod_reccomplejas2.dat_configcondicion.tipodato,mod_reccomplejas2.dat_configcondicion.condicionpordefecto,mod_reccomplejas2.dat_configcondicion.expresionregular,
                mod_reccomplejas2.dat_configcondicion.sqlwhere,mod_reccomplejas2.dat_configcondicion.idtabla,mod_reccomplejas2.dat_configcondicion.usarcondicion,
                mod_reccomplejas2.dat_configcondicion.representartbar, mod_reccomplejas2.dat_configcondicion.sqlfilter,mod_reccomplejas2.dat_configcondicion.idcampo
                FROM mod_reccomplejas2.dat_configcondicion
                where mod_reccomplejas2.dat_configcondicion.idcampo = $idcampoviejo
                " ;
                $objCampocd =  $conn->fetchAll($sqlC);
                //Datos configuracion condicion
                $idcampoc = $obj['idcampo'];
                $usarcondicion = $objCampocd[0]['usarcondicion'];
                $tipodato = $objCampocd[0]['tipodato'];
                $representartbar = $objCampocd[0]['representartbar'];
                $condicionpordefecto = $objCampocd[0]['condicionpordefecto'];
                $expresionregular = $objCampocd[0]['expresionregular'];
                $sqlwhere = $objCampocd[0]['sqlwhere'];
                $idtabla = $objCampocd[0]['idtabla'];
                $sqlfilter = $objCampocd[0]['sqlfilter'];

                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $sqlD = "INSERT INTO mod_reccomplejas2.dat_configcondicion(
                         idcampo,tipodato,condicionpordefecto,expresionregular, sqlwhere, idtabla, usarcondicion,representartbar,
                         sqlfilter)
                        VALUES ($idcampoc,'$tipodato','$condicionpordefecto','$expresionregular','$sqlwhere', '$idtabla',
                                $usarcondicion,$representartbar ,'$sqlfilter')" ;
                $conn->fetchAll($sqlD);
            }

            /*******************************PARA MODIFICAR LOS PADRES EN DAT_CAMPO****************************/
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "SELECT ca.idcampo,ca.denominacion FROM mod_reccomplejas2.dat_campo as ca where ca.idconfiguracion ilike '$idConfigOrigal' AND ca.idpadre is null" ;
            $padre = $conn->fetchAll($sql);

            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "SELECT ca.idcampo,ca.campo,ca.denominacion,ca.idpadre FROM mod_reccomplejas2.dat_campo as ca where ca.idconfiguracion ilike '$idConfigOrigal' AND ca.idpadre is not null" ;
            $hijos = $conn->fetchAll($sql);

            $arraycombinacion =array();
            $conpadre=0;
            $conhijo=0;
            foreach($padre as $p){
                foreach($hijos as $h){
                    if($p['idcampo']==$h['idpadre']){
                        $arraycombinacion[$conpadre]['denominacion']=$p['denominacion'];
                        $arraycombinacion[$conpadre]['Hijos'][$conhijo]=$h['denominacion'];
                        $conhijo++;
                    }
                }
                $conpadre++;
            }

            foreach($arraycombinacion as $r){
               $denominacion = $r['denominacion'];
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $sql = "SELECT ca.idcampo FROM mod_reccomplejas2.dat_campo as ca where ca.idconfiguracion ilike '$idconfiguracion' AND ca.denominacion ilike '$denominacion'" ;
                $padre = $conn->fetchAll($sql);
                $idpadre = $padre[0]['idcampo'];
                foreach($r['Hijos'] as $h){
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $sql = "UPDATE mod_reccomplejas2.dat_campo
                       SET idpadre=$idpadre
                       WHERE idconfiguracion ilike '$idconfiguracion' AND denominacion ilike '$h'" ;
                    $conn->fetchAll($sql);
                }
            }

        } catch (Exception $e) {
            die($e->getMessage());
        }
        return array();
    }

    public function cambiarPass($idconfiguracion, $newpass)
    {
        $query = Doctrine_Query::create()
            ->update()
            ->from('NomConfiguracion')
            ->set('claveproteccion', '?', $newpass)
            ->where('idconfiguracion = ?', $idconfiguracion);
        $query->execute();
    }

}