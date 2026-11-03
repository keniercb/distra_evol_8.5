<?php

/**
 * Modelo de negocio para gestionar los tipos de nómina.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomTipoNomina, Entidad tipo de nómina (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomAreasModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function NomAreasModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener todas las áreas
     *
     *
     * @return array Listado de áreas
     */
    public function obtenerTodosAreas($idestructura)
    {

        //Retornando el listado de áreas.
        return NomAreas::obtenerTodosAreas($idestructura);
    }

    public function obtenerAreas($idestructura)
    {
        //Retornando el listado de áreas.
        return NomAreas::obtenerAreas($idestructura);
    }

    public function obtenerListadoAreas($inicio = 0, $limite = 10, $idestructura)
    {

        //Retornando el listado de áreas.

        return NomAreas::obtenerListadoAreas($inicio, $limite, $idestructura);
    }

    public function obtenerCantidadTotalAreas($idestructura)
    {

        //Retornando la cantidad total de areas.
        return NomAreas::obtenerCantidadTotalAreas($idestructura);
    }

    public function adicionarAreas($denom, $finicio, $ffin, $composicion, $descrip, $orden, $multipleseleccioncargos, $idestructura)
    {
        try {
            if (!NomAreas::findByIdOrDenom($denom, null, $idestructura)) {

                //Se crea el objeto del area.
                $objArea = new NomAreas();

                //Insertando los datos del area.
                $objArea->denominacion = $denom;
                $fecha = split('/', $finicio);
                $objArea->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $fecha = split('/', $ffin);
                $objArea->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $objArea->composicion = $composicion;
                $objArea->descripcion = $descrip;
                $objArea->orden = $orden;
                $objArea->idestructura = $idestructura;
                $objArea->multipleseleccioncargos = ($multipleseleccioncargos == 'true')?1:0;

                //Guardando los datos.
                $objArea->save();
                return 2;
            } else {
                return 3;
            }
        } catch (Exception $e) {

            echo $e->getTraceAsString();
        }

    }

    /**
     * Modificar un area.
     *
     * @param int $idarea Identificador del area.
     * @param string $denom Denominacion del area.
     * @param string $finicio Fecha de inicio de creacion del area.
     * @param string $ffin Fecha de fin de uso del area.
     * @param string $descrip Descripcion del area.
     */
    public function modificarAreas($idarea, $denom, $finicio, $ffin, $composicion, $descrip, $orden, $multipleseleccioncargos,$idestructura)
    {


        try {
            if (!NomAreas::findByIdOrDenom($denom, $idarea, $idestructura)) {

                //Obteniendo el grupo escala. a modificar.
                $objArea = NomAreas::obtenerObjAreasDadoId($idarea);

                //Modificando los datos del area.
                $objArea->denominacion = $denom;
                $fecha = split('/', $finicio);
                $objArea->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $fecha = split('/', $ffin);
                $objArea->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $objArea->composicion = $composicion;
                $objArea->descripcion = $descrip;
                $objArea->orden = $orden;
                $objArea->multipleseleccioncargos = ($multipleseleccioncargos == 'true')?1:0;

                //Guardando los datos.
                $objArea->save();
                return 2;
            } else {
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }

    }

    /**
     * Eliminar un area.
     *
     * @param int $idarea Identificador del area.
     */
    public function eliminarAreas($idarea)
    {

        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('NomAreas')
                ->where('idarea = ?', $idarea)
                ->execute();
            return $r;
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                return 2;
            } else {
                return 1;
            }
        }
    }


    /*****************************//////************************************/
    public function obtenerEstructuraArea($idarea, $chek)
    {

        //Se obtienen los cargos de la plantilla especificada.
        $arrayCargos = NomAreasCargos::obtenerCargosByIdArea($idarea);
        $arrArbol = array();

        if (count($arrayCargos) > 0) {
            //Se obtienen los �conos de la aplicaci�n.
            $arriconos = $this->integrator->metadatos->obtenerConceptos();

            //Arreglo auxiliar con los cargos que contiene esa plantilla.
            $arrayAux = array();
            foreach ($arrayCargos as $valor => $value) {
                $arrayAux[] = $value['idcargo'];
            }
            $arrCaminosCargos = $this->integrator->metadatos->getRutaEstructura($arrayAux);
            //print_r($arrCaminosCargos);die;
            $rcaminos = array();
            $contrcaminos = 0;
            foreach ($arrCaminosCargos as $cc => $rcam) {
                $rid = explode('/', $arrCaminosCargos[$cc]['rutaId']);
                $rtext = explode('/', $rcam['rutaDenominacion']);
                foreach ($rtext as $t => $text) {
                    $rcaminos[$contrcaminos]['idfila'] = $rid[$t];
                    if ($t == 0) {
                        $rcaminos[$contrcaminos]['idpadre'] = $rcaminos[$contrcaminos]['idfila'];
                    } else {
                        $rcaminos[$contrcaminos]['idpadre'] = $rid[$t - 1];
                    }
                    $estruc = $this->integrator->metadatos->DameEstructura($rid[$t]);
                    //print_r($estruc);die;
                    $rcaminos[$contrcaminos]['idnomeav'] = $estruc[0]->idtipo;
                    $rcaminos[$contrcaminos]['denominacion'] = $text;
                    $contrcaminos++;
                }
            }
            for ($i = 0; $i < count($rcaminos); $i++) {
                for ($j = $i + 1; $j < count($rcaminos); $j++) {
                    if ($rcaminos[$i]['idfila'] == $rcaminos[$j]['idfila']) {
                        unset($rcaminos[$j]);
                        $rcaminos = array_values($rcaminos);
                    }
                }
            }
            if (count($rcaminos) > 0) {

                foreach ($rcaminos as $i => $nodo) {
                    if ($nodo['idfila'] == $nodo['idpadre']) {
                        $n = $this->conformarNodo($nodo, $arriconos, $chek);
                        $n['children'] = $this->conformarArbolRecursivo($rcaminos, $nodo, $arriconos, $chek);
                        $n['expanded'] = true;
                        $arrArbol[] = $n;
                    }
                }
            }
        }
        //print_r($arrArbol);die;
        return $arrArbol;
    }

    /**
     * Funci�n auxiliar para conformar los nodos del �rbol.
     *
     * @param array nodo        Datos del cargo.
     * @param array arriconos    Datos de los �conos de la aplicaci�n.
     *
     * @return array Nodo.
     */
    private function conformarNodo($nodo, $arriconos, $chek)
    {

        $icono = $nodo['idnomeav'];
        foreach ($arriconos as $key => $value) {
            if ($value['idconcepto'] == $icono)
                $icono = $value['icon'];
        }
        $arr = array();
        $arr['id'] = $nodo['idfila'];
        $arr['text'] = $nodo['denominacion'];
        $arr['tipoestructura'] = $nodo['idnomeav'];
        $arr['icon'] = $icono;
        //$arr['icon'] = $nodo['icon'];
        if ($nodo['idnomeav'] == 7)
            $arr['leaf'] = true;
        else $arr['leaf'] = false;
        if ($chek) {
            $arr['checked'] = false;
        }
        $arr['qtip'] = '<b>' . $nodo['denominacion'] . '</b>';
        return $arr;
    }

    /**
     * Funci�n auxiliar para conformar el �rbol de manera recursiva.
     *
     * @param array arrCaminos  Todos los cargos.
     * @param array nodo        Datos del cargo.
     * @param array arriconos    Datos de los �conos de la aplicaci�n.
     *
     * @return array Nodo.
     */
    private function conformarArbolRecursivo($arrCaminos, $nodo, $arriconos, $chek)
    {
        if ($nodo['idnomeav'] == 7)
            return;
        $arrHijos = $this->buscarHijos($arrCaminos, $nodo['idfila']);

        $arrArbol = array();
        foreach ($arrHijos as $k => &$v) {
            $n = $this->conformarNodo($v, $arriconos, $chek);
            $n['children'] = $this->conformarArbolRecursivo($arrCaminos, $v, $arriconos, $chek);
            $n['expanded'] = true;
            $arrArbol[] = $n;
            $i++;
        }
        return $arrArbol;
    }

    /**
     * Funci�n auxiliar para obtener los hijos dado un id del padre.
     *
     * @param array arrCaminos    Todos los cargos.
     * @param int idpadre            Datos del cargo.
     *
     * @return array Arreglo de hijos.
     */
    private function buscarHijos($arrCaminos, $idpadre)
    {
        $arr = array();
        foreach ($arrCaminos as $k => $v) {
            if ($v['idpadre'] == $idpadre && $v['idfila'] != $idpadre) {
                $arr[] = $v;
            }

        }

        return $arr;
    }

    /**
     * Obtener la estructura restante de estructura y composici�n.
     *
     * @param int $identidad Identificador de la entidad.
     * @return array Estructura restantes.
     */
    public function obtenerEstructuraRestantes($identidad, $nodo)
    {

        //Se obtiene el arreglo de iconos.
        //$arriconos = $this->integrator->metadatos->BuscartodosnomencladoresEAV();

        $arrArbol = array();

        if ($nodo == 'root') {

            $arrayEstru = $this->integrator->metadatos->DameEstructura($identidad);
            //print_r($arrayEstru);die;
            if ($arrayEstru[0]->idnomeav != '') {
                $icon = $this->buscarIcono($arriconos, $arrayEstru[0]->idnomeav);
                $icono = '/metadatos/comun/recursos/iconos/' . $icon . '.gif';
            }
            $arrArbol[0]['id'] = $arrayEstru[0]->idestructura;
            $arrArbol[0]['text'] = $arrayEstru[0]->denominacion;
            $arrArbol[0]['tipoestructura'] = $arrayEstru[0]->idnomeav;
            $arrArbol[0]['icon'] = $arrayEstru[0]->icon;
            if ($arrayEstru[0]->idnomeav == 4 || $arrayEstru[0]->idnomeav == 5) {
                $arrArbol[0]['checked'] = false;
                $arrArbol[0]['leaf'] = true;
            } else {
                $arrArbol[0]['leaf'] = false;
            }
            //$arrArbol[0]['qtip'] ='<b>'.$arrayEstru[0]->text.'</b>';
        } else {
            $arrayCargos = ConfPlantillaNominalCargo::obtenerCargosRegistradorByIdEstruc($identidad);
            $arrayAux = array();

            foreach ($arrayCargos as $key => $value) {
                $arrayAux[] = $value['idcargo'];
            }

            $hijosest = $this->integrator->metadatos->DameHijosEstructura($nodo);
            $lug = 0;

            foreach ($hijosest as $x => $y) {
                $exit = in_array($y->id, $arrayAux);
                $expicono = explode('=', $y->icon);
                $icono = '';
                if (count($expicono) > 1) {
                    $icono = '/metadatos/comun/recursos/iconos/' . $expicono[1] . '.gif';
                }
                //print_r($y->idconcepto);die;
                $arrArbol[$lug]['id'] = $y->id;
                $arrArbol[$lug]['text'] = $y->text;
                $arrArbol[$lug]['tipoestructura'] = $y->idconcepto;
                $arrArbol[$lug]['icon'] = $y->icon;
                if ($y->idconcepto == 7) {
                    if (!$exit)
                        $arrArbol[$lug]['checked'] = false;
                    $arrArbol[$lug]['leaf'] = true;
                } else {
                    $arrArbol[$lug]['leaf'] = false;
                }
                //$arrArbol[$lug]['qtip'] ='<b>'.$y->text.'</b>';
                $lug++;

            }
        }

        return $arrArbol;
    }

    /**
     * Funci�n utilizada para buscar un icno de una estructura.
     *
     * @param $arr        Array de iconos.
     * @param $id        Identificador del icono.
     *
     * return stirn Icono
     */
    private function buscarIcono($arr, $id)
    {
        foreach ($arr as $i => $v) {
            if ($v['idnomeav'] == $id) return $v['icono'];
        }
        return 'No conocido';
    }

    /**
     * Insertar una estructura de plantilla nominal.
     *
     * @param int $idplantilla Identificador de la plantilla nominal.
     * @param int $identidad Identificador de la plantilla nominal.
     * @param int $arrayCargos Arreglo de cargos.
     */
    public function adicionarEstructuraPlantillaNominal($idplantilla, $identidad, $arrayCargos)
    {
        //Se obtiene los cargos por estructura.
        //$estruccargos=$this->integrator->metadatos->BuscarCargosXIdestructuraSinDominio($identidad);

        /*$arrayCargosEstruc=array();
        foreach($estruccargos as $e=>$value){
          $arrayCargosEstruc[$e]=$value['idcargo'];
        }

        //Se obtienen los cargos seleccionados
        foreach($arrayCargos as $v){
          $aux=array();
          $todosaux=$this->integrator->metadatos->BuscarCargosXIdestructuraSinDominio($v);
          foreach($todosaux as $t=>$val){
            $aux[$t]=$val['idcargo'];
          }
          $arrayCargosEstruc = array_diff($arrayCargosEstruc,$aux);
        }*/

        //Se obtienen los cargos registrados en las plantillas de esa entidad, para verificar que no se repitan
        $arrayCargosReg = ConfPlantillaNominalCargo::obtenerCargosRegistradorByIdEstruc($identidad);

        $arrayCargosEstruc = array();
        //Se verifican los que se van a insertar con los registrados.
        foreach ($arrayCargos as $i => $c) {
            $encontrado = 2;
            foreach ($arrayCargosReg as $j => $cr) {
                if ($c == $cr) {
                    $encontrado = 1;
                    break;
                }
            }
            if ($encontrado == 2) {
                $arrayCargosEstruc[] = $c;
            }
        }


        foreach ($arrayCargosEstruc as $k => $c) {
            //Se crea el objeto de la estruc plantilla nominal.
            $objEsctPlantillaN = new ConfPlantillaNominalCargo();
            //Insertando los datos de la  estructura plantilla nominal.
            $objEsctPlantillaN->idcargo = $c;
            $objEsctPlantillaN->idplantillanominal = $idplantilla;
            //Guardando los datos.
            $objEsctPlantillaN->save();
        }
    }


    /**
     * Eliminar una estructura de plantilla nominal.
     *
     * @param int $idplantilla Identificador de la plantilla nominal.
     * @param int $arrayCargos Arreglo de cargos.
     */
    public function eliminarEstructuraPlantillaNominal($idplantilla, $arrayCargos)
    {

        ConfPlantillaNominalCargo::eliminarArrayCargos($idplantilla, $arrayCargos);

    }
}
