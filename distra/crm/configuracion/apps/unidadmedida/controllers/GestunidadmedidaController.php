<?php
/**
 * Componente para gestionar las unidades de medida de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Unidadmedida/Controllers
 * @copyright  XETID
 * @version    1.0
 */
class GestunidadmedidaController extends ZendExt_Controller_Secure
{

    /**
     * Constuctor de la clase
     */
    function init() 
    {
        parent::init();
    }

    /**
     * Gestionar unidad de medida
     * 
     */
    public function gestunidadmedidaAction() 
    {
        $this->render();
    }

    /**
     * Modificar magnitud
     * 
     * @throws ZendExt_Exception $ee
     */
    public function modificarMagnitudAction() 
    {
        $idmagnitud = $this->_request->getPost('idmagnitud_n');
        $denominacion = $this->_request->getPost('denominacionmagnitud');
        $descripcion = $this->_request->getPost('descripcionmagnitud');
        $ffin = $this->_request->getPost('fechafin');
        $finicio = $this->_request->getPost('fechainicio');
        $denominacionminuscula = strtolower($denominacion);
        try {
            $cantdemagnitudes = NomMagnitud::existeDenominacionMagnitudGest($denominacionminuscula, $idmagnitud);
            if ($cantdemagnitudes > 0) {
                echo ( "{'codMsg':-2}");
            } else {

                $datMagnitud = Doctrine::getTable('NomMagnitud')->find($idmagnitud);
                $datMagnitud->set('denominacionmagnitud', $denominacion)->save();
                $datMagnitud->set('descripcionmagnitud', $descripcion)->save();
                $datMagnitud->set('fechainicio', $finicio)->save();
                if ($ffin) {
                    $datMagnitud->set('fechafin', $ffin)->save();
                } else {

                    $datMagnitud->set('fechafin', null)->save();
                }

                echo ( "{'codMsg':-1}");
            }
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF143', $ee);
        }
    }

    /**
     * Adicionar magnitud
     * 
     */
    public function adicionarmagnitudAction() 
    {
        $idmagnitud = $this->_request->getPost('idmagnitud_n');
        $denominacion = $this->_request->getPost('denominacionmagnitud');
        $descripcion = $this->_request->getPost('descripcionmagnitud');
        $ffin = $this->_request->getPost('fechafin');
        $finicio = $this->_request->getPost('fechainicio');
        $denominacionminuscula = strtolower($denominacion);
        $cantdemagnitudes = NomMagnitud::existeDenominacionMagnitud($denominacionminuscula);
        if ($cantdemagnitudes > 0) {
            $dat->codMsgg = 42;
            if ($idmagnitud)
                $dat->codMsgg = 43;
        } else {
            $magnitud = new NomMagnitud();
            if ($idmagnitud) {
                $magnitud->idmagnitud = $idmagnitud;
            }
            $magnitud->denominacionmagnitud = $denominacion;
            $magnitud->descripcionmagnitud = $descripcion;
            $magnitud->fechafin = $ffin;
            $magnitud->fechainicio = $finicio;
            $magnitud->urimagnitud = strtolower($denominacion);
            NomMagnitudModel::insertar_modificar_nom_magnitud($magnitud);
            $dat->codMsgg = -1;
            if ($idmagnitud) {
                $dat->codMsgg = -2;
            }
        }
        echo json_encode($dat);
    }

    /**
     * Adicionar unidad de medida
     * 
     */
    public function adicionarumAction() 
    {
        $idmagnitud = $this->_request->getPost('idmagnitudO');
        $abreviaturaum = $this->_request->getPost('abreviaturaum');
        $denominacionum = $this->_request->getPost('denominacionum');
        $descripcionum = $this->_request->getPost('descripcionum');
        $ffinum = $this->_request->getPost('ffinum');
        $finicioum = $this->_request->getPost('finicioum');
        $idunidadmedida = $this->_request->getPost('idunidadmedida');
        $conversiones = $this->_request->getPost('conversiones');
        $decimales = $this->_request->getPost('decimales');
        $conversiones = json_decode(stripcslashes($conversiones));
        $unidadmedida = new NomUnidadmedida();
        $denominacionminuscula = strtolower($denominacionum);
        $cantum = NomUnidadmedida::exiteDenominacionUM(
            $denominacionminuscula, ($idunidadmedida) ? $idunidadmedida : null,
            $idmagnitud
        );
        if ($cantum > 0) {
            $dat->codMsgg = -42;
            if ($idunidadmedida)
                $dat->codMsgg = -43;
        } else {
            if ($idunidadmedida) {
                $unidadmedida->idunidadmedida = $idunidadmedida;
            } else {
                $unidadmedida->uriunidadmedida = $denominacionminuscula;
            }
            $unidadmedida->idmagnitud = $idmagnitud;
            $unidadmedida->abreviaturaunidadmedida = $abreviaturaum;
            $unidadmedida->denominacionunidadmedida = $denominacionum;
            $unidadmedida->descripcionunidadmedida = $descripcionum;
            $unidadmedida->fechainicio = $finicioum;
            $unidadmedida->fechafin = $ffinum;
            $unidadmedida->decimales = $decimales ? 1 : 0;
            $idunidadmedidaaux = NomUnidadmedidaModel::insertar_modificar_nom_unidadmedida($unidadmedida);
            if (!$idunidadmedidaaux)
                $idunidadmedidaaux = $idunidadmedida;
            if ($idunidadmedidaaux) {
                foreach ($conversiones as $conversion) {
                    $nomconversion = new DatConversion();
                    $nomconversion->idunidadmedida = $idunidadmedidaaux;
                    $nomconversion->idunidadmedidaconversion = $conversion->idunidadmedida;
                    if (!empty($conversion->factorconversion))
                        $nomconversion->factorconversion = $conversion->factorconversion;
                    DatConversionModel::insertarnom_unidadmedida_nom_unidadmedida($nomconversion);
                    $nomconversion = new DatConversion();
                    $nomconversion->idunidadmedida = $conversion->idunidadmedida;
                    $nomconversion->idunidadmedidaconversion = $idunidadmedidaaux;
                    $nomconversion->factorconversion = DatConversion::invertirFactor(
                            $conversion->factorconversion
                            );
                    DatConversionModel::insertarnom_unidadmedida_nom_unidadmedida($nomconversion);
                }
            }
            $dat->codMsgg = -1;
            if ($idunidadmedida) {
                $dat->codMsgg = -2;
            }
        }
        echo json_encode($dat);
    }

    /**
     * Listar Magnitudes
     * 
     */
    public function listarMagnitudAction() 
    {

        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        if ($this->_request->getPost('filtro')) {
         $magnitudes = NomMagnitud::buscarMagnitudPorNombre($this->_request->getPost('filtro'), $start, $limit);
         echo json_encode($magnitudes);
         return;
        } else {
            $magnitudes = NomMagnitud::getTodos($start, $limit);
            echo json_encode(array('total' => NomMagnitud::getTotal(), 'data' => $magnitudes));
            return;
        }
    }

    /**
     * Listar DN
     * 
     */
    public function listarDNAction() 
    {
        $dominiosnumericos = NomDominionumerico::listarDominiosNumericos();
        $result->data = $dominiosnumericos;
        echo json_encode($result);
    }

    /**
     * Listar unidad de medida
     * 
     */
    public function listarumAction() 
    {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $idmagnitud = $this->_request->getPost('idmagnitud');
        $unidadesmedida = NomUnidadmedida::getTodos($start, $limit, $idmagnitud);
        $result->total = NomUnidadmedida::getTotalDadoIdMag($idmagnitud);
        $result->data = $unidadesmedida;
        echo json_encode($result);
    }

    /**
     * Eliminar unidad de medida
     * 
     */
    public function eliminarumAction() 
    {
        $idunidadmedida = $this->_request->getPost('idunidadmedida');
        $unidadmedida = new NomUnidadmedida();
        $unidadmedida->idunidadmedida = $idunidadmedida;
        $flag = NomUnidadmedidaModel::deshabilitarUnidadMedida($unidadmedida);
        $dat->cod = 1;
        echo json_encode($dat);
    }

    /**
     * Listar conversión unida de medida
     * 
     */
    public function listarconversionesUMAction() 
    {
        $idmagnitud = $this->_request->getPost('idmagnitud');
        $idunidadmedida = $this->_request->getPost('idumed');
        $unidadesmedida = NomMagnitud::dameTodasUM($idmagnitud);
        $factores = DatConversion::getFactoresConversionDadoUM($idunidadmedida, $unidadesmedida);
        if ($idunidadmedida)
            $result->data = $factores;
        else
            $result->data = $unidadesmedida;

        echo json_encode($result);
    }

    /**
     * Eliminar Magnitud
     * 
     */
    public function eliminarmagnitudAction() 
    {
        $idmagnitud = $this->_request->getPost('idmagnitud');
        $magnitud = new NomMagnitud();
        $magnitud->idmagnitud = $idmagnitud;
        NomMagnitudModel::deshabilitarMagnitud($magnitud);
        $dat->cod = 1;
        echo json_encode($dat);
    }

    /**
     * Obtener factores de  Magnitud
     * 
     */
    public function obtenerFactoresConversionAction() 
    {
        $idum = 323;
        $factores = NomUnidadmedida::obtenerUnidadesMedidaConFactor($idum);
        $result->data = $factores;
        echo json_encode($result);
    }

    /**
     * Obtiene los datos para el reporte
     *
     * @author Ing. Lisvany Alonso Martinez
     *
     * @return void Echo con datos para el reporte
     */
    public function obtenerDatosImprimirReporteAction()
    {
        list($dia, $mes, $year) = explode("/", date('d/m/Y'));
        $entidad = $this->global->Estructura;
        $magnitudes = NomMagnitud::getTodosReporteMagnitud();
        //print_r($magnitudes);die;
        $tmp = array();
        /*$tr = '';*/
        $j = 0;
        foreach ($magnitudes as $index => $magnitud) {

            $tmp[$j]['denominacionmagnitud']
                = $magnitudes[$index]['denominacionmagnitud'];
            $tmp[$j]['denominacionunidadmedida'] = 'MAGNITUD: ';
            $tmp[$j]['abreviaturaunidadmedida'] = '&nbsp';
            $j++;
            $unidadesmedida = NomUnidadmedida::getTodosReporteUM(
                $magnitudes[$index]['idmagnitud']
            );
            //print_r($unidadesmedida);die;
            if (count($unidadesmedida) > 0) {
                $tmp[$j]['denominacionmagnitud'] = '&nbsp';
                $tmp[$j]['denominacionunidadmedida'] = 'UNIDAD DE MEDIDA';
                $tmp[$j]['abreviaturaunidadmedida'] = '&nbsp';
                $j++;
                $tmp[$j]['denominacionmagnitud'] = '&nbsp';
                $tmp[$j]['denominacionunidadmedida'] = 'DENOMINACI&Oacute;N';
                $tmp[$j]['abreviaturaunidadmedida'] = 'ABREVIATURA';
                $j++;
                foreach ($unidadesmedida as $i => $um) {

                    $tmp[$j]['denominacionmagnitud'] = '&nbsp';
                    $tmp[$j]['denominacionunidadmedida']
                        = $unidadesmedida[$i]['denominacionunidadmedida'];
                    $tmp[$j]['abreviaturaunidadmedida']
                        = $unidadesmedida[$i]['abreviaturaunidadmedida'];
                    $j++;
                }
            }
            $tmp[$j]['denominacionmagnitud'] = '&nbsp';
            $tmp[$j]['denominacionunidadmedida'] = '&nbsp';
            $tmp[$j]['abreviaturaunidadmedida'] = '&nbsp';
            $j++;
            //print_r($unidadesmedida);die;
            /*$tmp[$index]['um'] = $unidadesmedida;*/
        }
        $result = array('datoGeneral' => array('reporte' => '20006',
                                            'titulo' => 'mod_datosmaestros.nom_unidadmedida',
                                            'Entidad' => $entidad->denominacion,
                                            'dia' => $dia, 'mes' => $mes,
                                            'year' => $year,
                                            'fechaactual' => date('d/m/Y')),
                     'datoCuerpo'  => $tmp
                     );
        //print_r($result);die;
        echo json_encode($result);
        return;
    }

}
