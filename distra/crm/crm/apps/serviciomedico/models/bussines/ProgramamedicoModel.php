<?php

class ProgramamedicoModel extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_persona = new PersonaComunicationInterface();
        $this->_estructura = new EstructuraComunicationInterface();
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->_estadoDService = new OfertaNegocioEstadoDService();
    }

    public function getConfiguracion(){
        try {
            $config=array();
            $config['monedas_entidad'] = $this->_datosmaestros->getMonedasEntidad(
                $this->global->Estructura->idestructura
            );
            $config['estados_programamedico'] = $this->_estadoDService->getConfiguracionEstados(
                'programamedico');
//            foreach($resultado as $r){
//                $this->_extrafields['montomoneda_'.strtolower($r['codigoiso']).'_'.$r['idmoneda']]= array('type' => 'float');
//                $this->_extrafields['incremento_'.strtolower($r['codigoiso']).'_'.$r['idmoneda']]= array('type' => 'float');
//            }
            return array('success'=>true, 'config'=>$config);
        } catch (Exception $e) {
            return array('success'=>false, 'message'=>$e->getMessage());
        }
    }

    public function getProgramasMedicos($params){
        try {
            $result=DatProgramaMedico::listarProgramasMedicos($params);
            return $result;
        } catch (Exception $e) {
            return array(
                'success'=>false,
                'message'=>$e->getMessage(),
                'code'=>$e->getCode());
        }
    }

    public function guardarProgramaMedico($params){
        try {
            $model = new DatProgramaMedico();
            if($params['idprogramamedico'] && $params['idprogramamedico']!=''){
                $model = Doctrine::getTable('DatProgramaMedico')->find($params['idprogramamedico']);
            }
            $values=array_filter($params);

            $model->synchronizeWithArray($values);
            $con=Doctrine_Manager::getInstance()->getCurrentConnection();
            $con->beginTransaction();
            $model->save();
            if((isset($params['idprogramamedico']) && $params['idprogramamedico']=='') ||
                (DatProgramaMedicoEstado::obtenerUltimoEstado($params['idprogramamedico'])==null)) {
                $this->guardarEstadoInicial($model->idprogramamedico);
            }
            $this->guardarMonedas($model->idprogramamedico, $params);
//            print_r(gettype(json_decode($values['servicios'])));die;
//            $a='[{"nombre": "Federico", "numeroidentidad": "10120358964", "telefono": "45698723"}]';
//            $a2='[{nombre: "Federico", numeroidentidad: "10120358964", telefono: "45698723"}]';
//            $a3="[{'nombre': 'Federico', 'numeroidentidad': '10120358964', 'telefono': '45698723'}]";
//            $a4="[{\"nombre\": \"Federico\", \"numeroidentidad\": \"10120358964\", \"telefono\": \"45698723\"}]";
//            print_r(json_decode($a3));die;
            if($values['servicios']){
                $this->guardarServicios($model->idprogramamedico, json_decode($values['servicios']));
            }
            $con->commit();
            $this->comunicacionMasterhl7($params);
            return array('success'=>true);
        } catch (Exception $e) {
//            $conexionActual->rollback();
//            ob_clean();
            return array('success'=>false, 'message'=>$e->getMessage());
        }
    }

    private function comunicacionMasterhl7($params){
        $dir2 = split("web", $_SERVER['DOCUMENT_ROOT']);
        $configFile= '' . $dir2[0] .  'apps/masterhl7/comun/recursos/xml/config_his.xml';
//        print('/*comunica'.($params['idprogramamedico']!=''?'Mod':'Add').'*/');
        if (file_exists($configFile)) {
            $xmlCargado = simplexml_load_file($configFile);
            if($xmlCargado->config['configurado']==1){
                $conn = Doctrine_Manager::getInstance()->getCurrentConnection();

                $cliente = $conn->fetchRow("
                    SELECT nombre, codigo, dpa FROM mod_datosmaestros.nom_clientesproveedor 
                    WHERE idclientesproveedores=".$params['idpaciente']);
//                print_r($cliente);die;
                try{
                    $jsonvalue=json_decode($cliente['nombre']);
//                    if(!$jsonvalue)continue;
                    $params['1nombre']=$jsonvalue->{'pn'};
                    $params['2nombre']=$jsonvalue->{'sn'};
                    $params['1apellidos']=$jsonvalue->{'pa'};
                    $params['2apellidos']=$jsonvalue->{'sa'};
                }catch(Exception $e){
                    $params['nombrecliente']=$cliente['nombre'];
//                    continue;
                }
                $params['codigo']=$cliente['codigo'];
                $params['ci']=$cliente['codigo'];
                if($cliente['dpa']){
                    $dpa = $conn->fetchRow("SELECT idpais FROM mod_datosmaestros.nom_dpt WHERE iddpt=".$cliente['dpa']);
                    $paiscliente = $conn->fetchRow("SELECT nombrepais FROM mod_datosmaestros.nom_pais WHERE idpais=".$dpa['idpais']);
                    $params['paiscliente']=$paiscliente['nombrepais'];
                }
                if($params['idpais']){
                    $pais = $conn->fetchRow("SELECT nombrepais FROM mod_datosmaestros.nom_pais WHERE idpais=".$params['idpais']);
                    $params['abrpais']=$pais['siglas'];
                }
                if($params['idtipoprograma']) {
                    $tipoprograma = Doctrine::getTable('NomTipoPrograma')->find($params['idtipoprograma']);
                    $params['abrtipoprograma'] = $tipoprograma['abreviatura'];
                }
                if($params['idespecialidad']) {
                    $especialidad = $conn->fetchRow("SELECT abrevespecialidad FROM mod_datosmaestros.nom_especialidad WHERE idespecialidad=".$params['idespecialidad']);
                    $params['abrespecialidad'] = $especialidad['abrevespecialidad'];
                }
                $params['idpadre'] = $cliente['idpadre'];
                $this->integrator->masterhl7->ProgramaMedicoAHIS(
                    $params,
                    $params['servicios'],
                    $params['idprogramamedico']!=''?'Mod':'Add'); //$tipooperacion = 'Add' o 'Mod', $arrayidcliente =Datos del paciente
            }
        }
    }

    public function eliminarProgramasMedicos($params){
        try {
            DatProgramaMedico::eliminarProgramasMedicos($params);
            return array('success'=>true);
        } catch (Exception $e) {
            return array('success'=>false, 'message'=>$e->getMessage());
        }
    }

    public function cambiarEstadoProgramaMedico($values){
        try {
//        $datosrolesobligatorios=NomTransicion::obtenerRolesObligatorios(array('idtransicion'=>$values['idtransicion']));
//        $ultimoestado=DatProgramaMedicoEstado::obtenerUltimoEstado($values['idprogramamedico']);
//        $rolesparticipados=json_decode($ultimoestado['rolesobligatorios']);
//        if(!is_array($rolesparticipados))$rolesparticipados=array();
//        if(!in_array($this->global->Perfil->idrol, $rolesparticipados))$rolesparticipados[]=$this->global->Perfil->idrol;
//        $seguir=true; $obligatoriosefectuados=0;
//        foreach($datosrolesobligatorios as $rol){
//            if(!in_array($rol['idrol'], $rolesparticipados)){
//                $seguir=false;
//            }else{
//                $obligatoriosefectuados+=1;
//            }
//        }
//        DatProgramaMedicoEstado::actualizarRolesObligatorios(json_encode($rolesparticipados), $values['idprogramamedico']);
//        if($seguir) {
//            print_r($values);
//            die;
            //print_r($values);die; 
           // $programa=$this->getProgramasMedicos($values['idprogramamedico']);
            // print_r($programa);die; 
            DatProgramaMedicoEstado::actualizarFechaFinEstadoCuliminado(date('d/m/Y'), $values['idprogramamedico']);
           
            DatProgramaMedicoEstado::guardarProgramasMedicosEstados(array(
                'idestado' => $values['idestado'],
                'idprogramamedico' => $values['idprogramamedico'],
                'fechainicio' => date('d/m/Y'),
                'idusuario' => $this->global->Perfil->idusuario
            ));
            $pm=$this->getProgramasMedicos(array('idprogramamedico'=>$values['idprogramamedico']));
            $servi=DatProgramaMedicoServicio::listarProgramasMedicosServicios(array('idprogramamedico'=>$values['idprogramamedico']));
            $params=$pm['datos'][0];
            $params['servicios']=$servi;
            $this->comunicacionMasterhl7($params);
//            $dir2 = preg_split("web", $_SERVER['DOCUMENT_ROOT']);
//            $configFile= '' . $dir2[0] .  'apps/masterhl7/comun/recursos/xml/config_his.xml';
//            if (file_exists($configFile)) {
//                $xmlCargado = simplexml_load_file($configFile);
//                if ($xmlCargado->config['configurado'] == 1) {
//                    $pm=$this->getProgramasMedicos(array('idprogramamedico'=>$values['idprogramamedico']));
//                    $servi=DatProgramaMedicoServicio::listarProgramasMedicosServicios(array('idprogramamedico'=>$values['idprogramamedico']));
//                    $this->integrator->masterhl7->ProgramaMedicoAHIS(
//                        $pm['datos'][0],
//                        $servi,'Mod');
//                }
//            }

           // $this->comunicacionMasterhl7($params); 
            //        }
            return array('success'=>true, 'datos' => array(
                //            'cantidadrolesobligatorios'=>count($datosrolesobligatorios),
                //            'obligatoriosefectuados'=>$obligatoriosefectuados,
                'nuevoestado' => true));
        } catch (Exception $e) {
            return array('success'=>false, 'message'=>$e->getMessage());
        }
    }

    public function getListadoPersonas($params)
    {
        try {
            $params['idcargo'] = $this->_estructura->obtenerCargosEstructura($params);
            $params['idestructura'] = $this->global->Estructura->idestructura;
            return $this->_persona->getListadoPersonas($params);
        } catch (Exception $e) {
            return array('success'=>false, 'message'=>$e->getMessage());
        }
    }

    public function getTipoContacto(){
        try {
            $conexion = Doctrine_Manager::getInstance()->getCurrentConnection();
            $result=$conexion->fetchAll("
                SELECT * FROM mod_persona.nom_tipomediocontacto WHERE fhasta IS NULL
            ");
            return array('success'=>true, 'data'=>$result);
        } catch (Exception $e) {
            return array('success'=>false, 'message'=>$e->getMessage());
        }
    }

    public function getEspecialidades($params){
        try {
            $filtro = $params['denominacion'];
            $idespecialidad = $params['node'];
            if (!is_numeric($idespecialidad))$idespecialidad = 0;
            $buscar = (is_string($filtro) && $filtro != '') ? 1 : 0;
//            $tablas = MetadatosServices::getInstance()->dameArbolEspecialidad($idespecialidad, $buscar, $busqueda);
            $result = $this->integrator->datosmaestros->obtenerArbolEspecialidad($idespecialidad, $buscar, $filtro);
            return $result;
        } catch (Exception $e) {
            return array('success'=>false, 'message'=>$e->getMessage());
        }
    }

    public function getTiposProgramas(){
        try {
            $params['idestructura'] = $this->global->Estructura->idestructura;
            return $this->_datosmaestros->getCodicionesPago($params);
        } catch (Exception $e) {
            return array('success'=>false, 'message'=>$e->getMessage());
        }
    }

    public function getCondicionesPago(){
        try {

        } catch (Exception $e) {
            return array('success'=>false, 'message'=>$e->getMessage());
        }
    }

    public function getAreas(){
        try {

        } catch (Exception $e) {
            return array('success'=>false, 'message'=>$e->getMessage());
        }
    }

    private function guardarEstadoInicial($idprogramamedico){
        try {
            $estado = new NomEstado();
            $idestado = $estado->getEstadoInicial()['idestado'];
            if (!$idestado) {
                throw new Exception('No existe el estado inicial.', 333);
            }
            $instance = new DatProgramaMedicoEstado();
            $instance->idestado = $idestado;
            $instance->idprogramamedico = $idprogramamedico;
            $instance->idusuario = $this->global->Perfil->idusuario;
            $instance->fechainicio = date('d/m/Y');
            $instance->save();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function guardarMonedas($idprogramamedico, $parametros)
    {
        try {
            $monedas = new Doctrine_Collection('DatProgramaMedicoMoneda');
            foreach ($parametros as $k => $v) {
                if (preg_match('/montomoneda_/i', $k)) {
                    $temp = explode('_', $k);
                    $moneda = Doctrine::getTable('DatProgramaMedicoMoneda')
                        ->findByDql(
                            'idprogramamedico=? and idmoneda=?',
                            array($idprogramamedico, $temp[2])
                        );
                    if (!$moneda->count()) {
                        $moneda = new DatProgramaMedicoMoneda();
                        $moneda->idprogramamedico = $idprogramamedico;
                        $moneda->idmoneda = $temp[2];
                    } else {
                        $moneda = $moneda->getFirst();
                    }
                    $moneda->valor = $this->formatearNumero($v);
//                    print_r($v);die;
                    $monedas->add($moneda);
                }
            }
            $monedas->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function guardarServicios($idprogramamedico, $servicios){
        try {
            $ids=array();
            foreach ((array)$servicios as $serv) {
//                $serv=(array)$serv;
                $serv->{'idprogramamedico'}=$idprogramamedico;
                $ids[]=DatProgramaMedicoServicio::guardarProgramaMedicoServicio($serv);
            }
            $query = new Doctrine_Query();
            $query->delete()
                ->from('DatProgramaMedicoServicio')
                ->where('idprogramamedico=?', $idprogramamedico);
            if(count($ids))
                $query->andWhereNotIn('idprogramamedicoservicio', $ids);
//            print('$idprogramamedico:'.$idprogramamedico);
//            print_r($ids);
//            print_r($query->getSqlQuery());die;
            $query->execute();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function formatearNumero($numero)
    {
        return str_replace(',', '.', $numero);
    }

    public function facturarProgramaMedico($idprogramamedico){
        $servicios=DatProgramaMedicoServicio::listarProgramasMedicosServicios(array('idprogramamedico'=>$idprogramamedico));
        $model = Doctrine::getTable('DatProgramaMedico')->find($idprogramamedico);
        foreach ($servicios as $key => $value) {
            $servicios[$key]['cantidad'] = 1;
            if ($value['codigo'] == null) {
                $servicios[$key]['codigo'] = $value['numeropieza'];
            }
        }
        $parametros = array(
            'codigo' => 0,
            'tipoDoc' => 2,
            'idcliente' => $model['idpaciente'],
            'idsubsistema' => -1,
            'idoperacion' => 990000000238, // 990000005768,
            'idestructuracomun' => $this->global->Estructura->idestructura, // 200530666,
            'servicios' => $servicios
        );
        $parametros['connection'] = Doctrine_Manager::getInstance()->getCurrentConnection()->getName();
        $respuesta = $this->integrator->logistica->facturar($parametros);
//        $respuesta = $this->_modelFactura->adicionarFactura($parametros);
		return $respuesta;
    }

    public function getDatosAdicionales($params){
        $response=array();
        $response['servicios']=DatProgramaMedicoServicio::listarProgramasMedicosServicios($params);
        return $response;
    }

    public function exportarProgramaMedico($params){
//        print(date('Y-m-d h:i a'));die;
//        print($_SERVER['DOCUMENT_ROOT'].'/crm/application/views/images/logo_cira.png');
//        print(str_replace('/', '\\', $_SERVER['DOCUMENT_ROOT'].'/crm/application/views/images/logo_cira.png'));die;
        $dir_www = $_SERVER['DOCUMENT_ROOT'];
        $dir_rel_mt = '/'; //Direccion del Marco de trabajo relativa a la carpeta de publicacion.
        $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt); //Direccion absoluta del marco de trabajo
        include($dir_abs_mt . 'apps/pvd/comun/recursos/Mpdf/mpdf.php');
        $filtro = array('idprogramamedico'=>$params['idprogramamedico']);
        $programamedico=DatProgramaMedico::listarProgramasMedicos($filtro);
        $servicios=DatProgramaMedicoServicio::listarProgramasMedicosServicios($filtro);
        $moneda = 'CUP'; $nombremoneda = 'Peso Cubano';
        $idmoneda = null;
        foreach ($servicios['data'][0] as $k => $v) {
            if (preg_match('/montomoneda_/i', $k)) {
                if((float)$v != 0){
                    $temp = explode('_', $k);
                    $idmoneda = $temp[2];
                }
            }
        }
        if($idmoneda){
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $monedadata = $conn->fetchRow("
                    SELECT m.codigoiso, m.nombremoneda FROM mod_datosmaestros.nom_moneda m 
                    WHERE m.idmoneda=".$idmoneda);
            if($monedadata){
                $moneda = $monedadata['codigoiso'];
                $nombremoneda = $monedadata['nombremoneda'];
            }
        }
        if(count($programamedico['datos'])) {
            $pm = $programamedico['datos'][0];
//            print_r($programamedico);die;
            $pdf = new mPDF();
            $tituloReporte = 'Programa Medico_' . date('Y-m-d');
            header("Cache-Control: no-cache, must-revalidate");
            header("Content-type: application/octect-stream");
            header("Content-type: application/pdf");

            $html =
                '<div style="border: 1px solid black; border-radius: 4px; padding: 12px; margin-bottom: 5px">
                    
                    <table style="width: 100%; ">
                        <tr style="height: 60px;">
                            <td style="width: 33%"><img src="'.str_replace('/', '\\', $_SERVER['DOCUMENT_ROOT'].'/crm/application/views/images/logo_cira.png').'"/></td>
                            <td colspan="2" style="width: 33%; font-weight: bold; font-size: 16px; text-align: start">Clínica Central Cira García</td>
                        </tr>
                        <tr height="70px" style="height: 50px">
                            <td style="width: 33%; font-weight: bold">Programa Médico</td>
                            <td style="width: 33%; font-size: 12px; text-align: right;">
                                <span>Fecha y Hora de Impresión:</span><br>
                                <span>Impreso Por:</span>
                            </td>
                            <td style="width: 33%;">
                                <div style="display: grid; font-size: 12px;">
                                    <span>' . date('d/m/Y') . '    ' . date('h:i a') . '</span><br>
                                    <span> '.$this->global->Perfil->usuario.' </span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 33%"><b>Moneda</b> '.$moneda.'</td>
                            <td style="width: 33%;">'.$nombremoneda.'</td>
                            <td style="width: 33%"></td>
                        </tr>
                    </table>
                </div>
                <div style="border: 1px solid black; border-radius: 4px; padding: 10px 8px; margin-bottom: 5px;">
                    <table style="font-size: 13px; width: 100%;">
                        <tr>
                            <td width="25%" style="font-weight: bold">Paciente:</td>
                            <td width="40%" >' . $pm['paciente'] . '</td>
                            <td width="20%" style="font-weight: bold">#:</td>
                            <td width="15%" >'.$pm['numero'].'</td>
                        </tr>
                        <tr>
                            <td width="25%" style="font-weight: bold">Fecha de solicitud:</td>
                            <td width="40%" >' . $pm['fechasolicitud'] . '</td>
                            <td width="20%" style="font-weight: bold;">Edad:</td>
                            <td width="15%" >'.$pm['edad'].'</td>
                        </tr>
                        <tr>
                            <td width="25%" style="font-weight: bold">Pais:</td>
                            <td width="40%" >' . $pm['pais'] . '</td>
                            <td width="20%" style="font-weight: bold;">Acompañantes:</td>
                            <td width="15%" >'.$pm['acompannantes'].'</td>
                        </tr>
                        <tr>
                            <td width="25%" style="font-weight: bold">Tipo de contacto:</td>
                            <td colspan="3">' . $pm['tipocontacto'] . '</td>
                        </tr>
                        <tr>
                            <td width="25%" style="font-weight: bold">Emisor:</td>
                            <td colspan="3">' . $pm['emisor'] . '</td>
                        </tr>
                        <tr>
                            <td  colspan="4" style="font-weight: bold">Motivo de solicitud:</td>
                        </tr>
                        <tr>
                            <td  colspan="4">' . $pm['motivosolicitud'] . '</td>
                        </tr>
                        <tr>
                            <td width="25%" style="font-weight: bold">Tipo de programa:</td>
                            <td colspan="3">' . $pm['tipoprograma'] . '</td>
                        </tr>
                        <tr>
                            <td width="25%" style="font-weight: bold">Estado del programa:</td>
                            <td width="40%" ></td>
                            <td width="20%" style="font-weight: bold;">Último reajuste:</td>
                            <td width="15%" ></td>
                        </tr>
                        <tr>
                            <td width="25%" style="font-weight: bold">Especialidad:</td>
                            <td colspan="3" >' . $pm['especialidad'] . '</td>
                        </tr>
                        <tr>
                            <td colspan="4" style="font-weight: bold">Descripción:</td>
                        </tr>
                        <tr>
                            <td colspan="4">' . $pm['descripcion'] . '</td>
                        </tr>
                        <tr>
                            <td width="25%" style="font-weight: bold">Historia Clínica:</td>
                            <td width="40%" >' . $pm['historiaclinica'] . '</td>
                            <td width="20%" style="font-weight: bold;">Habitación:</td>
                            <td width="15%" >'.$pm['habitacion'].'</td>
                        </tr>
                        <tr>
                            <td width="25%" style="font-weight: bold">Fecha entrada:</td>
                            <td width="40%" >' . $pm['fechaentrada'] . '</td>
                            <td width="20%" style="font-weight: bold;">Fecha salida:</td>
                            <td width="15%" >'.$pm['fechasalida'].'</td>
                        </tr>
                    </table>
                </div>
                <div style="border: 1px solid black; border-radius: 4px; padding: 10px 8px; margin-bottom: 5px;">
                    <table style="font-size: 13px; width: 100%;"> 
                        <tr> 
                            <td width="50%" style="font-weight: bold">Médico que Realiza el Programa</td>   
                            <td width="50%" style="font-weight: bold">Especialidad</td>
                        </tr>
                        <tr>
                            <td width="50%" >' . $pm['emisor'] . ' </td>   
                            <td width="50%" >' . $pm['especialidad'] . '</td>
                        </tr>
                    </table>
                </div>
                <div style="border: 1px solid black; border-radius: 4px; padding: 4px 8px; margin-bottom: 6px">
                    <table style="font-size: 12px; width: 100%;">
                        <tr>
                            <td style="width: 60%; font-weight: bold;">Servicios</td>
                            <td style="width: 10%; font-weight: bold; text-align: right;">Precio</td>
                            <td style="width: 10%; font-weight: bold; text-align: right;">Cantidad</td>
                            <td style="width: 9%; font-weight: bold; text-align: right;">%Desc.</td>
                            <td style="width: 11%; font-weight: bold; text-align: right;"> Importe</td>
                        </tr>
                    </table>
                </div>
                <table style="font-size: 12px; width: 100%; margin: 0px 10px 10px 10px">';
            $importetotal = 0;
            foreach ($servicios['data'] as $serv){
                $html = $html.
                    ' <tr> 
                        <td style="width: 60%; ">'.$serv['denominacion'].' </td>   
                        <td style="width: 10%; text-align: right; margin-right: 10px">'.number_format((float)$serv['total'], 2).'</td>  
                        <td style="width: 10%; text-align: right; margin-right: 10px">'.$serv['cantidad'].' </td> 
                        <td style="width: 8%; text-align: right; margin-right: 10px"> </td> 
                        <td style="width: 12%; text-align: right; margin-right: 10px">'.number_format(((int)$serv['cantidad'] * (float)$serv['total']), 2).'</td>  
                    </tr>';
                $importetotal += ((int)$serv['cantidad'] * (float)$serv['total']);
            }
            $html = $html.'</table>';
            $html .=
                '<div style="border: 1px solid black; border-radius: 4px; padding: 4px 8px; margin-bottom: 6px">
                    <table style="width: 100%;">
                        <tr>
                            <td style="width: 60%; font-size: 12px;">Los servicios subrrayados no estan facturados</td>
                            <td style="width: 25%; font-weight: bold; font-size: 12px;">Total Programa</td>
                            <td style="width: 15%; font-weight: bold; text-align: right;">'.number_format($importetotal, 2).'</td>
                        </tr>
                    </table>
                </div>';
            $html = $html.'
                <div style="border: 1px solid black; border-radius: 4px; padding: 10px; margin-bottom: 6px">
                    <b>Observaciones</b><br>
                    ' . $pm['observaciones'] . ' <br>
                </div>
                <br><br>
                <span>______________________________________________________</span><br>
                <span>Aprobado Por TERESA NOTO FERNANDEZ</span>';
            $pdf->WriteHTML($html);
            $pdf->Output($tituloReporte . '.pdf', 'D');
        }else{
            return array('success'=>false, 'message'=>'Programa médico no encontrado. 
            Por favor actualice la vista principal para tener el listado más actual de programas médicos e inténtelo de nuevo.');
        }
    }

}
