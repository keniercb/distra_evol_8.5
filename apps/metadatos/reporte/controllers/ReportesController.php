<?php

/***
 * Class NomcategoriaocupacionalModel
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */

/** @noinspection PhpUndefinedClassInspection */
class ReportesController extends ZendExt_Controller_Secure
{
    /**
     * @var
     */
    private $_usuario;

    /**
     *
     */
    function init()
    {
        /** @noinspection PhpUndefinedClassInspection */
        parent::init();
        $this->_usuario = $this->global->Perfil->idusuario;
    }

    /**
     * Constructor
     */
    function gestionarreportesAction()
    {
        $this->render();
    }

    /**
     * Descripción del método: Construye el formulario dado los datos que se llenan de una tabla
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @copyright Copyright (c) 2014 xetid
     */
    function buscarHijosAction()
    {
        $idEstructura = (isset ($_POST ['node']) && $_POST ['node'] != '') ? ($_POST ['node'] ==
            'Estructuras') ? FALSE : $_POST ['node'] : die ("{'codMsg':3,'mensaje': 'Id tabla no enviado'}");
        $marcado = $_POST ['marcado'];
        $modelEstructura = new EstructuraModel();
        $result = $modelEstructura->dameHijosEstructura($idEstructura, FALSE, $marcado, 0);
        if (count($result) > 0) {
            $resultado = [];
            $index = 0;
            foreach ($result as $value) {
                $resultado [] = $value;
                $resultado [$index] ['checked'] = FALSE;
                $index++;
            }
            echo(json_encode($resultado));
        } else {
            echo(json_encode([]));
        }
    }

    /**
     * Descripción del método: Devuelve los hijos de una estructura determinada
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @copyright Copyright (c) 2014 xetid
     */
    function dameHijosAction()
    {
        $idpadre = $_POST['idpadre'];
        $modelEstructura = new EstructuraModel();
        $result = $modelEstructura->dameHijosEstructura($idpadre);
        echo json_encode($result);
    }

    /**
     * Descripción del método:Devuelve los hijos de un padre determinado en la estructura
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @copyright Copyright (c) 2014 xetid
     */
    function dameHijosPadreAction()
    {
        $idpadre = $_POST['idpadre'];
        $modelEstructura = new EstructuraModel();
        $result = $modelEstructura->dameHijosPadre($idpadre);
        echo json_encode($result);
    }

    //******************Acciones del componente graficar **************************************************
    /**
     * Descripción del método: Retorna un arreglo con los conceptos que pueden ser graficados.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    function getConceptosAction()
    {
        $modelNomConcepto = new NomConceptoModel();
        $resultado = $modelNomConcepto->dameConceptosGraficables();
        echo json_encode(['cantidad' => count($resultado), 'datos' => $resultado]);
    }

    /**
     * Descripción del método: Retorna un arreglo con las propiedades asociadas a un concepto
     *
     * @author    : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    function damePropiedadesAction()
    {
        $idconcepto = $_POST ['idconcepto'];
        $modelGrafica = new DatGraficaModel();
        $propiedades = $modelGrafica->propiedadesPorConcepto($idconcepto);
        echo json_encode($propiedades);
    }

    /**
     * Descripción del método: Retorna un arreglo con las configuraciones creadas (incluye el filtro por
     * denominación)
     *
     * @author    : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarConfiguracionAction()
    {
        /** @noinspection PhpUndefinedMethodInspection */
        $datos['limit'] = $this->_request->getPost('limit');
        /** @noinspection PhpUndefinedMethodInspection */
        $datos['start'] = $this->_request->getPost('start');
        /** @noinspection PhpUndefinedMethodInspection */
        $denominacion = $this->_request->getPost("denominacion") ? $this->_request->getPost("denominacion") : '';
        $datos['denominacion'] = $denominacion;
        $model = new DatGraficaModel();
        $cantidad = $model->cantidad();
        $datos = $model->obtenerConfiguracion($datos, $this->_usuario);
        echo(json_encode(['cantidad' => $cantidad, 'datos' => $datos[0]]));
    }

    /**
     * Descripción del método: Guarda la configuración creada
     *
     * @author    : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    function guardarConfiguracionAction()
    {
        $denominacion = $_POST ['denominacion'];
        $descripcion = $_POST ['descripcion'];
        $configuracion = $_POST ['configuracion'];
        $modelGrafica = new DatGraficaModel();
        $result = $modelGrafica->guardarConfiguracion($denominacion, $descripcion, $configuracion);
        if ($result) {
            echo("{'codMsg':1,'mensaje': 'La configuración ha sido adicionada satisfactoriamente.'}");
        } else {
            echo("{'codMsg':3,'mensaje': 'Ha ocurrido un error al adicionar la configuración.'}");
        }
    }

    /**
     * Descripción del método: Modifica la configuración seleccionada
     *
     * @author    : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    function modificarConfiguracionAction()
    {
        $denominacion = $_POST ['denominacion'];
        $descripcion = $_POST ['descripcion'];
        $configuracion = $_POST ['configuracion'];
        $idgrafica = $_POST ['idgrafica'];
        $modelGrafica = new DatGraficaModel();
        $result = $modelGrafica->modificarConfiguracion($idgrafica, $denominacion, $descripcion, $configuracion);
        if ($result) {
            echo("{'codMsg':1,'mensaje': 'La configuración ha sido modificada satisfactoriamente.'}");
        } else {
            echo("{'codMsg':3,'mensaje': 'Ha ocurrido un error al modificar la configuración.'}");
        }
    }

    /**
     * Descripción del método: Elimina la configuración seleccionada
     *
     * @author    : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    function eliminarConfiguracionAction()
    {
        $idgrafica = $_POST ['idgrafica'];
        $modelGrafica = new DatGraficaModel();
        $result = $modelGrafica->eliminarConfiguracion($idgrafica);
        if ($result) {
            echo("{'codMsg':1,'mensaje': 'La configuración ha sido eliminada satisfactoriamente.'}");
        } else {
            echo("{'codMsg':6,'mensaje': 'Ha ocurrido un error al eliminar la configuración.'}");
        }
    }

    /**
     * Descripción del método: Marca una grafica por defecto
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    function marcarConfiguracionAction()
    {
        $idgrafica = $_POST ['idgrafica'];
        $marcar = $_POST ['marcar'];
        $domain = new DatGraficaUsuario();
        $eliminado = $domain->eliminar($this->_usuario);
        if (!$marcar) {
            if ($domain->insertar($idgrafica, $this->_usuario)) {
                echo("{'codMsg':1,'mensaje': 'La configuración ha sido marcada por defecto satisfactoriamente.'}");
            } else {
                echo("{'codMsg':6,'mensaje': 'Ha ocurrido un error al seleccionar la configuración por defecto.'}");
            }
        } else {
            if ($eliminado) {
                echo("{'codMsg':1,'mensaje': 'La configuración ha sido desmarcada satisfactoriamente.'}");
            } else {
                echo("{'codMsg':6,'mensaje': 'Ha ocurrido un error al desmarcar la configuración.'}");
            }
        }
    }

    /**
     * Descripción del método: Devuelve un arreglo con la información a visualizar en la vista(para la acción de
     * modifiacar)
     *
     * @author    : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    function actualizarArrayVistaAction()
    {
        /** @noinspection PhpUndefinedMethodInspection */
        $configuracion = Zend_Json::decode(stripslashes($this->_request->getPost("configuracion")));
        $modelGrafica = new DatGraficaModel();
        $configReal = $modelGrafica->construirConfigReal($configuracion);
        if (count($configReal[1]) > 1) {
            $result['vacio'] = FALSE;
            $arrayText = $modelGrafica->actualizarArrayVista($configReal);
            $result['denominaciones'] = $arrayText;
            $result['identificadores'] = $configReal;
            $result['iguales'] = $modelGrafica->compararArrays($configuracion, $configReal);
        } else {
            $result['vacio'] = TRUE;
        }
        echo json_encode($result);
    }

    /**
     * Descripción del método: Devuelve un arreglo con los valores que serán graficados
     *
     * @author    : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    function dameValoresGraficarAction()
    {
        /** @noinspection PhpUndefinedMethodInspection */
        $configuracion = Zend_Json::decode(stripslashes($this->_request->getPost("configuracion")));
        /** @noinspection PhpUndefinedMethodInspection */
        $idestructuras = Zend_Json::decode(stripslashes($this->_request->getPost("idestructuras")));
        $modelGrafica = new DatGraficaModel();
        $result = $modelGrafica->valoresAGraficar($configuracion, $idestructuras);
        $resultado = [];
        if (count($result[1]) > 0) { //Elimino los valores que vengan nulos
            $resultado[0] = $result[0];
            foreach ($result[1] as $i => $value) {
                if ($result[1][$i]['cantidad'] != NULL && $result[1][$i]['cantidad'] != 0) {
                    $resultado[1][] = $result[1][$i];
                }
            }
            echo json_encode($resultado);
        } else {
            echo json_encode($result);
        }
    }

    /**
     * Descripción del método: Devuelve un arreglo con la información asociada a la propiedad seleccionada.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarPropiedadAction()
    {
        /** @noinspection PhpUndefinedMethodInspection */
        $limit = $this->_request->getPost('limit');
        /** @noinspection PhpUndefinedMethodInspection */
        $start = $this->_request->getPost('start');
        /** @noinspection PhpUndefinedMethodInspection */
        $busqueda = $this->_request->getPost('filter');
        /** @noinspection PhpUndefinedMethodInspection */
        $id = $this->_request->getPost('identificador');
        $modelGrafica = new DatGraficaModel();
        $propiedades = $modelGrafica->mostrarPropiedades($limit, $start, $busqueda, $id);
        $tablas = $propiedades['tablas'];
        $total = $propiedades['total'];
        if (count($tablas) > 0) {
            echo json_encode(['cantidad' => $total, 'datos' => $tablas]);
        } else {
            echo("{'codMsg':1,'mensaje': 'No existen datos que mostrar.'}");
        }
    }

    /**
     *
     */
    function cargarEstructuraAction()
    {
        $idest = (isset ($_POST ['node']) && $_POST ['node'] != '') ? ($_POST ['node'] ==
            'Estructuras') ? FALSE : $_POST ['node'] : die ("{'codMsg':3,'mensaje': 'Id tabla no enviado'}");
        $marcado = $_POST ['marcado'];
        $modelEstructura = new EstructuraModel();
        $result = $modelEstructura->dameHijosEstructura($idest, FALSE, $marcado);
        if (count($result) > 0) {
            $resultado = [];
            $index = 0;
            foreach ($result as $value) {
                $resultado [] = $value;
                if ($resultado [$index] ['leaf'] == FALSE) {
                    $resultado [$index] ['checked'] = FALSE;
                }
                $index++;
            }
            echo(json_encode($resultado));
        } else {
            echo(json_encode([]));
        }
    }
}