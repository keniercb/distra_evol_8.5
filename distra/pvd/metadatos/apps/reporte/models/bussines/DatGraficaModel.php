<?php

/**
 * Clase modelo para el componente reporte gráfico.
 *
 * @author    : Ing. Pedro Alberto Jiménez
 * @copyright Copyright (c) 2014 xetid
 */
class DatGraficaModel extends ZendExt_Model
{
    /**
     * @var
     */
    private $_dominio;
    /**
     * @var object
     */
    private $_perfil;

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     *
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new DatGrafica();
        $this->_perfil = Util::getPerfilGlobal();
        $this->_dominio = $this->_perfil->iddominio;
    }

    /**
     * Descripción del método: Devuelve la cantidad de configuraciones existentes en la base de datos.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     * @return mixed :int, Retorna la cantidad de configuraciones existentes en la base de datos
     * @copyright Copyright (c) 2013 xetid
     */
    public static function cantidad()
    {
        $q = Doctrine_Query::create();
        $result = $q->from('DatGrafica g')->execute()->count();
        return $result;
    }

    /**
     * Descripción del método:  Devuelve un arreglo con la configuración a graficar.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     * @modify    : Ing. Pedro Alberto Jiménez
     *
     * @param  array $datos Datos del filtro a aplicar para obtener la información.
     * @param        $usuario
     *
     * @return array, arreglo con la configuración.
     * @copyright Copyright (c) 2013 xetid
     */
    public function obtenerConfiguracion($datos, $usuario)
    {
        $result = DatGrafica::obtenerConfiguracion($datos, $usuario);
        $configuraciones = array();
        $proy = $result['datos'];
        foreach ($proy as $i => $proyect) {
            $configuraciones[$i]['idgrafica'] = $proyect['idgrafica'];
            $configuraciones[$i]['denominacion'] = $proyect['denominacion'];
            $configuraciones[$i]['descripcion'] = $proyect['descripcion'];
            $configuraciones[$i]['configuracion'] = $proyect['configuracion'];
            $configuraciones[$i]['defecto'] = $proyect['defecto'];
        }
        /** @noinspection PhpTraditionalSyntaxArrayLiteralInspection */
        return array($configuraciones);
    }

    /**
     * Descripción del método:  Guarda la configuración a graficar.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param string $denominacion  Denominación de la configuración.
     * @param string $descripcion   Descripción de la configuración.
     * @param string $configuracion Configuración de la gráfica.
     *
     * @return bool, TRUE si guardó satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function guardarConfiguracion($denominacion, $descripcion, $configuracion)
    {
        $newid = DatGrafica::ultimoID();
        $object = new DatGrafica();
        $object->idgrafica = $newid;
        $object->denominacion = ucfirst($denominacion);
        $object->descripcion = $descripcion;
        $object->configuracion = $configuracion;
        $object->save();
        return TRUE;
    }

    /**
     * Descripción del método:  Guarda los cambios realizados a la información asociada a la configuración
     * seleccionada.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param int    $idgrafica     Identificador de la configuración a modificar.
     * @param string $denominacion  Denominación de la configuración.
     * @param string $descripcion   Descripción de la configuración.
     * @param string $configuracion Configuración de la gráfica.
     *
     * @return bool, TRUE si modificó satisfactoriamente.
     * @copyright Copyright (c) 2013 xetid
     */
    public function  modificarConfiguracion($idgrafica, $denominacion, $descripcion, $configuracion)
    {
        $object = Doctrine::getTable('DatGrafica')->find($idgrafica);
        if (is_object($object)) {
            $object->denominacion = ucfirst($denominacion);
            $object->descripcion = $descripcion;
            $object->configuracion = $configuracion;
            $object->save();
            return TRUE;
        } else {
            return FALSE;
        }
    }

    /**
     * Descripción del método:  Devuelve las propiedades asociadas a un concepto.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param int $idconcepto Identificador del concepto.
     *
     * @return array, información asociada a las propiedades relacionadas con este concepto.
     * @copyright Copyright (c) 2013 xetid
     */
    public function propiedadesPorConcepto($idconcepto)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT p.*,cp.idconceptopropiedad FROM mod_estructuracomp.nom_concepto nc
       inner join mod_estructuracomp.nom_conceptopropiedad cp on(nc.idconcepto = cp.idconcepto)
       inner join mod_estructuracomp.nom_propiedad p
       on (p.idpropiedad = cp.idpropiedad) WHERE nc.idconcepto = $idconcepto order by p.denominacion";
        $result = $conn->fetchAll($sql);
        return $result;
    }

    /**
     * Descripción del método:  Devuelve la denominación de un concepto.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param int $idconcepto Identificador del concepto.
     *
     * @return array, identificador y denominación de este concepto.
     * @copyright Copyright (c) 2013 xetid
     */
    public function denominacionPorConcepto($idconcepto)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select c.denominacion as text, c.idconcepto from mod_estructuracomp.nom_concepto c
        where c.idconcepto = $idconcepto";
        $data = $conn->fetchAll($sql);
        return $data;
    }

    /**
     * Descripción del método:  Devuelve la denominación de los valores seleccionados para una propiedad.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param $idConc              Identificador del concepto.
     * @param $idVal               Identificador de los valores.
     * @param $idCP                Identificador de la realación entre el concepto y la propiedad.
     *
     * @return array, denominaciones asociadas a cada valor .
     * @copyright Copyright (c) 2013 xetid
     */
    public function denominacionPorValores($idConc, $idVal, $idCP)
    {
        if ($idCP != 7) {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $denominacion = ($idCP != 6) ? 'denominacion' : 'salario';
            $info = NomConceptoPropiedadModel::buscarConceptoPropiedad($idCP);
            $tabla = $info['referencia'];
            $whereInner = NomConceptoPropiedadModel::getCondValuesByPro($idCP, $info['identificador'], $idVal, $idConc);
            $where = $whereInner['where'];
            $inner = $whereInner['inner'];
            $sql = "select distinct p.$denominacion as denominacion from mod_estructuracomp.$tabla p $inner
            where $where";
            $data = $conn->fetchAll($sql);
        } else { //Para el caso de los medios
            $data = MetadatosService::getInstance()->dameDatosMedios($idVal);
        }
        return $data;
    }

    /**
     * Descripción del método:  Devuelve los valores a graficar para el concepto Medio.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param array $configuracion Configuración de la gráfica.
     * @param int   $idestructuras Identificador de las estructuras.
     *
     * @return array, valores a graficar.
     * @copyright Copyright (c) 2013 xetid
     */
    private function valoresConceptomedio($configuracion, $idestructuras)
    {
        $condiciones = DatGrafica::obtenerCondiciones('idnommedio', $configuracion, $idestructuras);
        $resultado = DatGrafica::obtenerValores($condiciones, 9, $idestructuras);
        foreach ($resultado[1] as $index => $value) {
            $idmedios[] = $value['id'];
        }
        $data = MetadatosServices::getInstance()->dameDatosMedio($idmedios);
        foreach ($resultado[1] as $index => $value) {
            foreach ($data as $v) {
                if ($value['id'] == $v['idindicador']) {
                    $resultado[1][$index]['denominacion'] = $v['denominacion'];
                }
            }
        }
        return $resultado;
    }

    /**
     * Descripción del método:  Devuelve un arreglo con los valores que cumplen con la configuración seleccionada.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param array $configuracion Configuración de la gráfica.
     * @param int   $idestructuras Identificador de las estructuras.
     *
     * @return array, arreglo de valores que cumplen con las condiciones descritas en la configuración.
     * @copyright Copyright (c) 2013 xetid
     */
    public function valoresAGraficar($configuracion, $idestructuras)
    {
        $concepto = $configuracion[0];
        if ($concepto < 5) {
            $condiciones = DatGrafica::obtenerCondiciones('idestructura', $configuracion, $idestructuras);
            $resultado = DatGrafica::obtenerValores($condiciones, $concepto, $idestructuras);
        } else {
            if ($concepto == 7) {
                $condiciones = DatGrafica::obtenerCondiciones('idnomcargo', $configuracion, $idestructuras);
                $resultado = DatGrafica::obtenerValores($condiciones, $concepto, $idestructuras);
            } else {
                if ($concepto == 9) {
                    $resultado = DatGraficaModel::valoresConceptoMedio($configuracion, $idestructuras);
                } else {
                    $condiciones = DatGrafica::obtenerCondiciones('idestructuraop', $configuracion, $idestructuras);
                    $resultado = DatGrafica::obtenerValores($condiciones, $concepto, $idestructuras);
                }
            }
        }
        return $resultado;
    }

    /**
     * Descripción del método:  Devuelve un arreglo con las denominaciones de los valores guardados en la
     * configuración.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param array $configuracion Configuración de la gráfica.
     *
     * @return array, arreglo de denominaciones de los valores almacenados en la configuración.
     * @copyright Copyright (c) 2013 xetid
     */
    public function actualizarArrayVista($configuracion)
    {
        $idConcepto = $configuracion[0];
        $concepto = DatGraficaModel::denominacionPorConcepto($idConcepto);
        $arrayreturn[0] = $concepto[0]['text'];
        foreach ($configuracion as $i => $value) {
            /** @noinspection PhpTraditionalSyntaxArrayLiteralInspection */
            $denValores = array();
            if ($i > 0) {
                $propiedad = NomPropiedadModel::buscarPropiedad($value[0]);
                $propiedad = $propiedad[0];
                $arrayreturn[$i][] = $propiedad['text'];
                $idctopropiedad = $value[0];
                $resultValores = self::denominacionPorValores($idConcepto, implode(',', $value[1]), $idctopropiedad);
                foreach ($resultValores as $valor) {
                    $denValores[] = $valor['denominacion'];
                }
                $arrayreturn[$i][] = $denValores;
            }
        }
        return $arrayreturn;
    }

    /**
     * Descripción del método:  Crea un nuevo arreglo de configuración, poniendo solo los valores que aún
     * persisten en la estructura, de acuerdo a la configuración seleccionada.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param array $configuracion Configuración de la gráfica.
     *
     * @return array, arreglo con la nueva configuración.
     * @copyright Copyright (c) 2013 xetid
     */
    public function construirConfigReal($configuracion)
    {
        $arrayreturn[0] = $configuracion[0];
        foreach ($configuracion as $i => $value) {
            if ($i > 0) {
                $arrayreturn[$i][0] = $value[0];
                $idconceptopropiedad = $value[0];
                $data = DatGrafica::valoresActuales($configuracion[0], $idconceptopropiedad, implode(',', $value[1]));
                foreach ($data as $valor) {
                    $arrayreturn[$i][1][] = $valor['text'];
                }
            }
        }
        return $arrayreturn;
    }

    /**
     * Descripción del método: Elimina la configuración seleccionada.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param int $idgrafica Identificador de la configuración a eliminar.
     *
     * @return array, arreglo con la nueva configuración.
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminarConfiguracion($idgrafica)
    {
        $object = Doctrine::getTable('DatGrafica')->find($idgrafica);
        if (is_object($object)) {
            $object->delete();
        }
        return TRUE;
    }

    /**
     * Descripción del método: Comprueba que dos arreglos lineales son iguales.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param array $a Arreglo lineal.
     * @param array $b Arreglo lineal.
     *
     * @return bool, retorna true si poseen los mismos valores.
     * @copyright Copyright (c) 2013 xetid
     */
    private function compararArrayLineal($a, $b)
    {
        $flag = count(array_diff($a, $b));
        return $flag == 0;
    }

    /**
     * Descripción del método: Comprueba que dos arreglos de 3 niveles son iguales.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param array $configuracion Arreglo de 3 niveles.
     * @param array $configReal    Arreglo de 3 niveles.
     *
     * @return bool, retorna true si poseen los mismos valores.
     * @copyright Copyright (c) 2013 xetid
     */
    public function compararArrays($configuracion, $configReal)
    {
        $flag = TRUE;
        if (count($configReal) != count($configuracion)) {
            return FALSE;
        } else {
            foreach ($configuracion as $index => $value) {
                if ($index > 0) {
                    $flag = DatGraficaModel::comprobarPorPosiciones($configReal, $configuracion, $index);
                    if (!$flag) {
                        break;
                    }
                }
            }
            return $flag;
        }
    }

    /**
     * Descripción del método: Usada por la función compararArray() para buscar por cada una de las posiciones
     * del arreglo configuración.
     *
     * @author    : Ing. Pedro Alberto Jiménez
     *
     * @param array $configuracion Arreglo de 3 niveles.
     * @param array $configReal    Arreglo de 3 niveles.
     * @param int   $index         Posición del arreglo configuracion en la que se realizará la comprobación.
     *
     * @return bool, retorna true si poseen los mismos valores.
     * @copyright Copyright (c) 2013 xetid
     */
    private function comprobarPorPosiciones($configReal, $configuracion, $index)
    {
        $flag = TRUE;
        foreach ($configReal as $i => $v) {
            if ($i > 0) {
                if ($configuracion[$index][0] == $configReal[$i][0]) {
                    $a = $configuracion[$index][1];
                    $b = $configReal[$i][1];
                    if (!DatGraficaModel::compararArrayLineal($a, $b)) {
                        $flag = FALSE;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
        return $flag;
    }

    /**FUNCIONES PARA LA GESTION DE LAS CONFIGURACIONES*/
    private function dameConfiguracionPropiedad($tipo)
    {
        $config = array(
            'clase' => 'DatEstructura', 'especialidad' => 'idespecialidad', 'id' => 'idestructura');
        /**IDENTIFICADORES*/
        switch ($tipo){
            case 1:
                /**Cargos*/
                $config['id'] = 'idnomcargo';
                break;
            case 2:
                /**Categoria civil*/
                $config['id'] = 'idcategocup';
                break;
            case 3:
                /**Grado*/
                $config['id'] = 'idgrado';
                break;
            case 4:
                /**Preparacion*/
                $config['id'] = 'idpreparacion';
                break;
            case 6:
                /**Salarios*/
                $config['id'] = 'idsalario';
                break;
            case 7:
                /**Medio*/
                $config['id'] = 'idnommedio';
                break;
            case 8:
                /**Especialidad por cargos*/
                $config['id'] = 'idcargo';
                $config['especialidad'] = 'idespecialidadempleo';
                break;
            case 9:
                /**Estructura no formal*/
            case 20:
                /**Organo interno*/
            case 22:
                /**Agrupación interna*/
                $config['id'] = 'idestructuraop';
                break;
            case 10:
                /**Tipo de Organo*/
            case 12:
                /**Tipo de agrupación*/
            case 15:
                /**Organo interno*/
            case 17:
                /**Tipo de Organizacion*/
            case 21:
                /**Tipo de órgano interno*/
            case 23:
                /**Tipo de agrupación interna*/
            case 25:
                /**Tipo de no formal*/
                $config['id'] = 'idorgano';
                break;
            case 24:
                /**Tipo de mediol*/
                $config['id'] = 'idtipomedio';
                break;
        }

        /**CONCEPTOS*/
        switch ($tipo){
            case 1:
                /**Cargos*/
            case 8:
                /**Especialidad por cargos*/
                $config['tipo'] = 7;
                break;
            case 6:
                /**Salario*/
            case 3:
                /**Grado*/
            case 24:
                /**Tipo Medio*/
                $config['tipo'] = FALSE;
                break;
            case 9:
                /**Estructura no formal*/
                $config['tipo'] = 8;
                break;
            case 10:
                /**Tipo de Organo*/
            case 11:
                /**Organo*/
                $config['tipo'] = 1;
                break;
            case 12:
                /**Tipo de agrupación*/
            case 13:
                /**Agrupación*/
                $config['tipo'] = 2;
                break;
            case 15:
                /**Tipo de Entidad*/
            case 16:
                /**Especialidades por entidad*/
                $config['tipo'] = 3;
                break;
            case 17:
                /**Tipo de Organizacion*/
            case 18:
                /**Organizacion*/
            case 19:
                /**Especialidad de Organizaciones*/
                $config['tipo'] = 4;
                break;
            case 7:
                /**Medios*/
                $config['tipo'] = 9;
                break;
            case 20:
                /**Organo interno*/
            case 21:
                /**Tipo de órgano interno*/
                $config['tipo'] = 5;
                break;
            case 22:
                /**Agrupación interna*/
            case 23:
                /**Tipo de agrupación interna*/
                $config['tipo'] = 6;
                break;
            case 25:
                /**Tipo de no formal*/
                $config['tipo'] = 8;
                break;
        }


        /**CLASES*/
        switch ($tipo){
            case 1:
                /**Cargos*/
            case 4:
                /**Preparacion*/
            case 6:
                /**Salarios*/
                $config['clase'] = 'DatCargo';
                break;
            case 2:
                /**Categoria civil*/
                $config['clase'] = 'DatCargocivil';
                break;
            case 3:
                /**Grado*/
                $config['clase'] = 'DatCargomilitar';
                break;
            case 7:
                /**Medios*/
                $config['clase'] = 'DatMedio';
                break;
            case 8:
                /**Especialidad por cargos*/
                $config['clase'] = 'DatCargo';
                break;
            case 9:
                /**Estructura no formal*/
                $config['clase'] = 'DatEstructuraop';
                break;
            case 20:
                /**Organo interno*/
            case 21:
                /**Tipo de órgano interno*/
            case 22:
                /**Agrupación interna*/
            case 23:
                /**Tipo de agrupación interna*/
            case 25:
                /**Tipo de no formal*/
                $config['clase'] = 'DatEstructuraop';
                break;
            case 24:
                /**Tipo medio*/
                $config['clase'] = 'DatMedio';
                break;
        }

        /**ALTERNATIVES CLASES*/
        switch ($tipo){
            case 1:
                /**Organo denominacion*/
                $config['alter_clase'] = 'NomCargo';
                break;
            case 2:
                /**Categoria civil*/
                $config['alter_clase'] = 'NomCategocup';
                break;
            case 3:
                /**Grado*/
                $config['alter_clase'] = 'NomGrado';
                break;
            case 4:
                $config['alter_clase'] = 'NomPreparacion';
                break;
            case 6:
                $config['alter_clase'] = 'NomSalario';
                break;
            case 24:
                $config['alter_clase'] = 'NomTipomedio';
                break;
            case 10:
                /**Organo*/
            case 12:
                /**Agrupación*/
            case 15:
                /**Entidad*/
            case 17:
                /**Organizacion*/
            case 21:
                /**Órgano interno*/
            case 23:
                /**Agrupacion interna*/
            case 25:
                /**No Formales*/
                $config['alter_clase'] = 'NomOrgano';
                break;
        }
        return $config;
    }

    /**
     * @param $lt
     * @param $st
     * @param $search
     * @param $id
     *
     * @return array
     */
    public function mostrarPropiedades($lt, $st, $search, $id)
    {
        $data = self::dameConfiguracionPropiedad($id);
        switch ($id){
            /**DENOMINACION DE CONCEPTOS*/
            case 9:
                /**Estructura no formal*/
            case 11:
                /**Organo*/
            case 13:
                /**Agrupacion*/
            case 18:
                /**Organización*/
            case 20:
                /**Organo interno*/
            case 22:
                /**Agrupación interna*/
                $datos = $this->cantidadEnUso($data['tipo'], $data['id'], $data['clase'], $search);
                $total = $datos['cantidad'];
                $ids = $datos['ids'];
                $tablas = $this->mostrarEnUso($data['tipo'], $data['id'], $data['clase'], $ids, $lt, $st, $search);
                break;
            /**TIPO DE ORGANOS */
            case 10:
                /**Organo*/
            case 12:
                /**Agrupación*/
            case 15:
                /**Entidad*/
            case 17:
                /**Organizacion*/
            case 21:
                /**Órgano interno*/
            case 23:
                /**Agrupación interna*/
            case 25:
                /**No Formales*/
                $org = $this->cantidadEnUso($data['tipo'], $data['id'], $data['clase'], $search);
                $total = $org['cantidad'];
                $org = $org['ids'];
                if ($total) {
                    $tablas = $this->mostrarEnUso($data['tipo'], $data['id'], $data['alter_clase'], $org, $lt, $st, $search, FALSE);
                } else {
                    $tablas = array();
                }
                break;
            /**ESPECIALIDADES*/
            case 8:
                /**Cargos*/
            case 16:
                /**Entidad*/
            case 19:
                /**Organizacion*/
                $especialidades = $this->cantidadEnUso($data['tipo'], $data['especialidad'], $data['clase'], $search);
                $total = $especialidades['cantidad'];
                $especialidades = $especialidades['ids'];
                $tablas = $this->buscarEspecialidadEnUso($lt, $st, $especialidades);
                if (count($tablas) < $lt && count($tablas) < $total) {
                    $total = count($tablas);
                }
                break;
            case 1:
                /**Cargos*/
            case 4:
                /**Preparacion*/
            case 6:
                /**Salarios*/
                $datos = $this->cantidadEnUso($data['tipo'], $data['id'], $data['clase'], $search);
                $data['tipo'] = FALSE;
                $total = $datos['cantidad'];
                $ids = $datos['ids'];
                if ($total) {
                    $tablas = $this->mostrarEnUso($data['tipo'], $data['id'], $data['alter_clase'], $ids, $lt, $st, $search, FALSE, (($id == 6) ? 'salario' : FALSE));
                } else {
                    $tablas = array();
                }
                break;
            case 3:
                /**Grado militar*/
                $datos = $this->cantidadEnUso($data['tipo'], $data['id'], $data['clase'], $search, TRUE);
                $data['tipo'] = FALSE;
                $total = $datos['cantidad'];
                $ids = $datos['ids'];
                if ($total) {
                    $tablas = $this->mostrarEnUso($data['tipo'], $data['id'], $data['alter_clase'], $ids, $lt, $st, $search, FALSE);
                } else {
                    $tablas = array();
                }
                break;
            case 2:
                /**Categoría ocupacional*/
                $datos = $this->cantidadEnUso($data['tipo'], $data['id'], $data['clase'], $search, TRUE);
                $data['tipo'] = FALSE;
                $total = $datos['cantidad'];
                $ids = $datos['ids'];
                if ($total) {
                    $tablas = $this->mostrarEnUso($data['tipo'], $data['id'], $data['alter_clase'], $ids, $lt, $st, $search, FALSE);
                } else {
                    $tablas = array();
                }
                break;
            case 24:
                /**Tipo de medios*/
                $datos = $this->cantidadEnUso($data['tipo'], $data['id'], $data['clase'], $search);
                $data['tipo'] = FALSE;
                $total = $datos['cantidad'];
                $ids = $datos['ids'];
                if ($total) {
                    $tablas = $this->mostrarEnUso($data['tipo'], $data['id'], $data['alter_clase'], $ids, $lt, $st, $search, FALSE);
                } else {
                    $tablas = array();
                }
                break;
            case 7:
                /**Medio*/
                $medios = $this->cantidadEnUso($data['tipo'], $data['id'], $data['clase'], $search);
                $total = $medios['cantidad'];
                $medios = $medios['ids'];
                $tablas = $this->buscarMediosEnUso($lt, $st, $medios);
                if (count($tablas) < $lt && count($tablas) < $total) {
                    $total = count($tablas);
                }
                break;
        }
        return array('total' => $total, 'tablas' => $tablas);
    }


    /**FUNCIONES DE CONSULTA PARA LA CONFIGURACIÓN GRAFICA*/
    /**
     * Busca todos los medios insertados en la estructura dado un identificador y los medios existentes en la
     * estructura que coinciden con un filtro dado
     *
     * @param int   $limit
     * @param int   $start
     * @param array $medios
     *
     * @return mixed : Retorna un arreglo con los elementos encontrados
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarMediosEnUso($limit = 10, $start = 0, $medios = array())
    {
        $medios = explode(',', $medios);
        $datos = MetadatosServices::getInstance()->dameDatosMedio($medios);
        $datosMedios = array();
        foreach ($medios as $medio) {
            if (count($datos)) {
                $cantidad = count($datosMedios);
                if ($cantidad >= $start AND $cantidad < $limit) {
                    $datosMedios[] = array(
                        'identificador' => $medio, 'denominacion' => $datos[$medio]['denominacion'],
                        'abreviatura' => '');
                }
            }
        }
        return $datosMedios;
    }

    /**
     * Descripción del método: Devuelve un arreglo con las especialidades de acuerdo al filtro de búsqueda y que se
     * encuentren en uso por algún cargo
     *
     * @author    : Ing. Pedro Alberto Jiménez
     * @modify    : Ing. Daymel Machado
     *
     * @param      $limit
     * @param int  $start
     * @param      $especialidades
     *
     * @return array Devuelve un arreglo con las especialidades
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarEspecialidadEnUso($limit, $start, $especialidades)
    {
        $especialidades = explode(',', $especialidades);
        $datosEspecialidades = array();
        foreach ($especialidades as $especialidad) {
            $datos = MetadatosServices::getInstance()->dameEspecialidad($especialidad);
            if (count($datos)) {
                $cantidad = count($datosEspecialidades);
                if ($cantidad >= $start AND $cantidad < $limit) {
                    $datosEspecialidades[] = array(
                        'identificador' => $especialidad, 'denominacion' => $datos[0]->denespecialidad,
                        'abreviatura' => $datos[0]->abrevespecialidad);
                }
            }
        }
        return $datosEspecialidades;
    }

    /**
     * Descripción del método: Devuelve la cantidad de Estructuras dado el id del concepto
     *
     * @author    : Ing. Pedro Alberto Jiménez
     * @modified  : Ing. Yoandry Borges
     *
     * @param      $idConcepto
     * @param      $campoId
     * @param      $clase
     * @param bool $busqueda
     * @param bool $includeCargoJoin
     *
     * @return int : int, Retorna la cantidad de elementos encontrados durante la busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public function cantidadEnUso($idConcepto, $campoId, $clase, $busqueda = FALSE, $includeCargoJoin = FALSE)
    {
        $tabla = $clase . " d";
        $where = UtilModel::whereBusquedaDinamica('d', $busqueda);
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $query = Doctrine_Query::create($conn);
        $query->addSelect("DISTINCT(d.$campoId)")->from("$tabla")
            ->addWhere("fila.fechafin IS NULL")
            ->addWhere("fila.dominiofila [$this->_dominio]=1::bit")
            ->addWhere($where);
        if ($includeCargoJoin) {
            $query->innerJoin("d.DatCargo cargo WITH cargo.idproyecto = d.idproyecto")
                ->innerJoin("cargo.NomFilaestruc fila")
                ->addWhere("cargo.idestado = 0");
        } else {
            $query->innerJoin("d.NomFilaestruc fila")->addWhere("d.idestado = 0");
        }
        if (is_numeric($idConcepto)) {
            $query->addWhere("fila.idconcepto = $idConcepto");
        }
        $query = $conn->fetchAll($query->getSqlQuery());
        $query = Util::getArrayByField($query, 'm__0');
        $cantidad = count($query);
        $query = ($cantidad != 0) ? implode(',', $query) : $query;
        return array('ids' => $query, 'cantidad' => $cantidad);
    }

    /**
     * Descripción del método: Muestra los datos de la estructura
     *
     * @author    : Ing. Javier Limonta
     * @modified  : Ing. Yoandry Borges
     *
     * @param      $idConcepto
     * @param      $campoId
     * @param      $clase
     * @param      $ids
     * @param      $limit
     * @param int  $start
     * @param bool $busqueda
     * @param bool $estado
     * @param bool $campoDenominacion
     *
     * @return mixed, Mustra los datos de la estructura
     * @copyright Copyright (c) 2013 xetid
     */
    public function mostrarEnUso(
        $idConcepto, $campoId, $clase, $ids, $limit, $start = 0, $busqueda = FALSE, $estado = TRUE,
        $campoDenominacion = FALSE
    )
    {
        $campoDenominacion = $campoDenominacion ? $campoDenominacion : 'denominacion';
        $tabla = $clase . " d";
        $where = UtilModel::whereBusquedaDinamica('d', $busqueda);
        $query = Doctrine_Query::create();
        $query->select("d.$campoDenominacion as denominacion, d.$campoId AS identificador")
            ->from($tabla)->where($where)->limit($limit)->offset($start);
        if ($ids . count > 0) {
            $query->addWhere("d.$campoId IN ($ids)");
        }
        if ($campoDenominacion != 'salario') {
            $query->addSelect("d.abreviatura");
        }
        if (is_numeric($idConcepto)) {
            $query->addWhere("d.idconcepto = $idConcepto");
        }
        if ($estado) {
            $query->addWhere("d.idestado = 0");
        }
        $resultado = $query->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $resultado;
    }
}