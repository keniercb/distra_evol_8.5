<?php

/**
 * Class BancosController
 *
 * @package    ConfiguraciÃ³n
 * @subpackage BancoSucursal/Controllers
 * @copyright  XETID
 * @version    1.0
 */
class BancosController extends ZendExt_Controller_Secure
{

    function init()
    {
        $this->bancoModel = new BancoModel();
        $this->model[] = new BancoModel();
        $this->model[] = new SucursalModel();
        parent::init();
    }

    function bancosAction()
    {
        /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
        $this->render();
    }

    /**
     * Obtiene los datos de Banco
     */
    function cargarAction()
    {
        $start = ($this->_request->getPost("start")) ? $this->_request->getPost("start") : 0;
        $limit = ($this->_request->getPost("limit")) ? $this->_request->getPost("limit") : 20;
        $cond = $this->_request->getPost();
        $elementos = NomBanco::buscarBanco($cond, $limit, $start);
        echo(json_encode($elementos));
    }

    /**
     * Carga los datos de sucursal
     */
    function cargarsucursalesAction()
    {
        $cond = $this->_request->getPost();
        $limit = $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $elementos = NomSucursal::buscarSucursal($cond, $limit, $start);
        echo(json_encode($elementos));
    }

    /**
     * Inserta un Banco
     *
     * @throws ZendExt_Exception
     */
    public function insertarAction()
    {
        try {
            $nomBanco = new NomBanco();
            $nomBanco->codigo = $this->_request->getPost('codigo');
            $nomBanco->nombre = $this->_request->getPost('nombre');
            $nomBanco->abreviatura = $this->_request->getPost('abreviatura');

            if (NomBanco::verificarExisteBanco(
                $this->_request->getPost('codigo'), $this->_request->getPost('nombre')
            )
            ) {
                echo("{'codMsg':-2}");
            } else {
                if ($nomBanco::verificarAbreviatura($this->_request->getPost('abreviatura'))) {
                    echo("{'codMsg':-3}");
                } else {
                    if ($nomBanco::verificarAbreviaturaVsBanco(
                        $this->_request->getPost('abreviatura'), $this->_request->getPost('nombre')
                    )
                    ) {
                        echo("{'codMsg':-4}");
                    } else {
                        if ($this->bancoModel->insertarNomBanco($nomBanco)) {
                            echo("{'codMsg':-1}");
                        }
                    }
                }
            }


        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF110', $ee);
        }
    }

    /**
     * Modifica un Banco
     *
     * @throws ZendExt_Exception
     */
    public function modificarAction()
    {
        try {
            $nomBanco = Doctrine::getTable('NomBanco')->find($this->_request->getPost('idbanco'));
            $nomBanco->idbanco = $this->_request->getPost('idbanco');
            $nomBanco->codigo = $this->_request->getPost('codigo');
            $nomBanco->nombre = $this->_request->getPost('nombre');
            $nomBanco->abreviatura = $this->_request->getPost('abreviatura');

            if ($this->model[0]->modificarNomBanco($nomBanco)) {
                echo("{'codMsg':-1}");
            } else {
                echo("{'codMsg':-2}");
            }
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF130', $ee);
        }
    }

    /**
     * Elimina un Banco
     *
     * @throws ZendExt_Exception
     */
    public function eliminarAction()
    {
        try {
            //$arrayBand = array(); //lleva el control de los que se han eliminados y no
            $nombreBancoEli = array(); //nombre de los bancos eliminados
            $nombreBancoNoEli = array(); //nombre de los bancos no eliminados
            $arrayBancos = json_decode(stripcslashes($this->_request->getPost('idbanco')));
            if (count($arrayBancos)) {
                foreach ($arrayBancos as $elem) {
                    $nomBanco = Doctrine::getTable('NomBanco')->find($elem);
                    $banco = $nomBanco->toArray();
                    //$arrayBand[] = $this->bancoModel->eliminarNomBanco($NomBanco);
                    if (!$this->bancoModel->eliminarNomBanco($nomBanco)) {
                        $nombreBancoNoEli[] = $banco['nombre'];
                    } else {
                        $nombreBancoEli[] = $banco['nombre'];
                    }
                }
            }
            echo json_encode(array('nombreBancoEli' => $nombreBancoEli, 'nombreBancoNoEli' => $nombreBancoNoEli));
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF150', $ee);
        }
    }

    /**
     * Inserta una Sucursal
     *
     * @throws ZendExt_Exception
     */
    public function insertarsucursalAction()
    {
        try {
            $nomSucursal = new NomSucursal();
            $nomSucursalintertar = new SucursalModel();
            $nomSucursal->numero = $this->_request->getPost('numero');
            $nomSucursal->direccion = $this->_request->getPost('direccion');
            $nomSucursal->idbanco = $this->_request->getPost('idbanco');
            $metodo = $this->_request->getPost('metodo');
            if ($metodo == 1 || $metodo == 0 || $metodo == -1) {
                $nomSucursal->metodo = $metodo;
            } else {
                $nomSucursal->metodo = 10;
            }
            
            
            $valor = $nomSucursalintertar->insertarNomSucursal($nomSucursal);
            //print_r($valor);die;
            if($valor==1)
            {
                 echo("{'codMsg':2,'mensaje': 'La sucursal ha sido adicionada satisfactoriamente.'}");
            }
            else
            
            echo("{'codMsg':1,'mensaje': 'La sucursal que quiere adicionar ya existe.'}");
            
           /* if ($this->model[1]->insertarNomSucursal($nomSucursal)) {
                echo("{'codMsg':2,'mensaje': 'La sucursal ha sido adicionada satisfactoriamente.'}");
            } else {
                echo("{'codMsg':1,'mensaje': 'La sucursal que quiere adicionar ya existe.'}");*/
            //}
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF120', $ee);
        }
    }

    /**
     * Modifica una Sucursal
     *
     * @throws ZendExt_Exception
     */
    public function modificarsucursalAction()
    {
        try {
            $nomSucursal = new NomSucursal();
            $nomSucursal = Doctrine::getTable('NomSucursal')->find($this->_request->getPost('idsucursal'));
            $nomSucursal->idsucursal = $this->_request->getPost('idsucursal');
            $nomSucursal->numero = $this->_request->getPost('numero');
            $nomSucursal->direccion = $this->_request->getPost('direccion');
            $nomSucursal->idbanco = $this->_request->getPost('idbanco');
            $metodo = $this->_request->getPost('metodo');
            if ($metodo == 1 || $metodo == 0) {
                $nomSucursal->metodo = $metodo;
            } else {
                $nomSucursal->metodo = 10;
            }
            if ($this->model[1]->modificarNomSucursal($nomSucursal)) {
                echo("{'codMsg':2,'mensaje': 'La sucursal ha sido modificada satisfactoriamente.'}");
            } else {
                echo("{'codMsg':1,'mensaje': 'La sucursal ya existe.'}");
            }
        } catch (ZendExt_Exception $ee) {

            throw new ZendExt_Exception('CONF140', $ee);
        }
    }

    /**
     * Elimina una Sucursal
     *
     * @throws ZendExt_Exception
     */
    public function eliminarsucursalAction()
    {
        try {
            if (strpos($this->_request->getPost('idsucursal'), ',')) {
                $elementos = split(",", $this->_request->getPost('idsucursal'));
                foreach ($elementos as $elem) {
                    $nomSucursal = new NomSucursal();
                    $nomSucursal = Doctrine::getTable('NomSucursal')->find($elem);
                    if ($this->model[1]->eliminarNomSucursal($nomSucursal) === '-4') {
                        echo("{'codMsgg':-4}");
                        return;
                    } else {
                        unset($nomSucursal);
                    }
                }
                echo("{'codMsgg':-5}");
                return;
            } else {
                $nomSucursal = new NomSucursal();
                $nomSucursal = Doctrine::getTable('NomSucursal')->find($this->_request->getPost('idsucursal'));
                if ($this->model[1]->eliminarNomSucursal($nomSucursal) === '-4') {
                    echo("{'codMsgg':-4}");
                    return;
                } else {
                    echo("{'codMsgg':-1}");
                    return;
                }
            }
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONTB048', $ee);
        }
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
        $bancos = NomBanco::ObtenerBancos();
        //print_r($magnitudes);die;
        $tmp = array();
        $j = 0;
        foreach ($bancos as $index => $magnitud) {


            $tmp[$j]['codigo'] = $bancos[$index]['codigo'];
            $tmp[$j]['nombre'] = $bancos[$index]['nombre'];
            $tmp[$j]['numero'] = '&nbsp';
            $tmp[$j]['direccion'] = 'BANCO: ';
            $j++;
            //print_r($magnitud);die;
            $sucursales = NomSucursal::todasSucursales($bancos[$index]['idbanco']);
            //print_r($unidadesmedida);die;
            if (count($sucursales) > 0) {
                $tmp[$j]['codigo'] = '&nbsp';
                $tmp[$j]['nombre'] = '&nbsp';
                $tmp[$j]['numero'] = '&nbsp';
                $tmp[$j]['direccion'] = 'SUCURSAL';
                $j++;

                $tmp[$j]['codigo'] = '&nbsp';
                $tmp[$j]['nombre'] = '&nbsp';
                $tmp[$j]['numero'] = '&nbsp';
                $tmp[$j]['direccion'] = 'DIRECCI&Oacute;N';
                $j++;

                foreach ($sucursales as $i => $s) {
                    $tmp[$j]['codigo'] = '&nbsp';
                    $tmp[$j]['nombre'] = '&nbsp';
                    $tmp[$j]['numero'] = $sucursales[$i]['numero'];
                    $tmp[$j]['direccion'] = $sucursales[$i]['direccion'];
                    $j++;
                }
            }
            $tmp[$j]['codigo'] = '&nbsp';
            $tmp[$j]['nombre'] = '&nbsp';
            $tmp[$j]['numero'] = '&nbsp';
            $tmp[$j]['direccion'] = '&nbsp';
            $j++;
        }
        $result = array('datoGeneral' => array('reporte'     => '20007',
                                               'titulo'      => 'mod_datosmaestros.nom_bancosucursal',
                                               'Entidad'     => $entidad->denominacion,
                                               'dia'         => $dia, 'mes' => $mes,
                                               'year'        => $year,
                                               'fechaactual' => date('d/m/Y')),
                        'datoCuerpo'  => $tmp
        );
        //print_r($result);
        echo json_encode($result);
        return;
    }

}
