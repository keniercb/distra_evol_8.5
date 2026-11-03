<?php

class DatNormaModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatNorma $DatNorma)
    {
        $DatNorma->save();
    }

    public function Actualizar(DatNorma $DatNorma)
    {
        $DatNorma->save();
    }

    public function Eliminar($DatNorma)
    {
        $DatNorma->delete();
    }

    /*
     * $idactividad contiene el identificador de la actividadde la cual se van a elimnar las normas
     * autor Pedro E Rojas
     */

    public function eliminarNormasDeUnaActividad($idactividad)
    {
        //Buscar las  normas de una actividad y eliminarlas
        $normas = DatNorma::buscarNormas($idactividad);
        foreach ($normas as $nor) { // por cada elemento de la lista se invoca al metodo eliminar
            $this->eliminarNorma($nor['idactividad'], $nor['idindicador']);
        }
        return $normas;
    }

    /* usado por el eliminar una actividad y por este model para eliminar varias normas */

    public function eliminarNorma($idactividad, $idindicador,$idejercicio)
    {
        $norma = Doctrine :: getTable('DatNorma')->findByDql(
            "idactividad = $idactividad AND idindicador = $idindicador AND idejercicio=$idejercicio"
        );
        return $this->Eliminar($norma);
    }

    public function eliminarVariasNormas($idactividad, $normas,$idejercicio)
    {
        foreach ($normas as $norma) {
            $this->eliminarNorma($idactividad, $norma->idindicador,$idejercicio);
        }
        return true;
    } 
    
      public function eliminarTodasReglas($idactividad)
    {
        $regla = new DatRegla();
        $regla->eliminarVariasReglas($idactividad);
    }   


    public function modificarNorma($normas, $idespecialidad_demandante)
    {
        $almacenados = array();
        $normaamod = array();

        foreach ($normas as $norma) {
            /* Actualizar la norma */
            $normamod = DatNorma::buscar($norma->idnorma);
            $normamod->cantplanif = ($norma->cantplanif != null) ? $norma->cantplanif : '1';
            $normamod->cantbase = ($norma->cantbase != null) ? $norma->cantbase : '1';
            $normamod->save();
            /* Opteniendo el precio del indicador releacionado a cada norma */
            $indicador = Doctrine::getTable('NomIndicadorplanif')->find($normamod->idindicador);
           $almacenados[] = array('idnorma'    => $norma->idnorma,
                                   'cantbase'   => $normamod->cantbase,
                                   'cantplanif' => $normamod->cantplanif,
                                   'importe'    => number_format(
                                       ($normamod->calcularNecesidad() * $indicador->precio), '3', '.', ','
                                   ));
        }
        return $almacenados;
    }

    function adicionarNorma(array $params)
    {

        $norma = new DatNorma();
        $norma->idactividad = isset($params['idactividad']) ? $params['idactividad'] : $norma->idactividad;
        $norma->idindicador = isset($params['idindicador']) ? $params['idindicador'] : $norma->idindicador;
        $norma->cantbase = isset($params['cantbase']) ? $params['cantbase'] : $norma->cantbase;
        $norma->cantplanif = isset($params['cantplanif']) ? $params['cantplanif'] : $norma->cantplanif;
        $norma->idaprobacion = isset($params['idaprobacion']) ? $params['idaprobacion'] : $norma->idaprobacion;
        /* Temporal arrreglar la version en la BD ver a Drigsi para que elabore el trigger */
        $norma->version = 1;
        $this->Insertar($norma);
    }

    function adicionarNormas($idactividad, $idejercicio, array $normas)
    {

        $almacenados = array();
        $normasConIndicador = array();
        foreach ($normas as $norma) {
            $nuevanorma = new DatNorma();

            $normaConIndicador = $this->buscarNormasEjercicios($idactividad, $norma->idindicador,$idejecicio)->getFirst();
            if ($normaConIndicador->idnorma == null) {
                if (is_object($nuevanorma)) {
                    $indicador = Doctrine::getTable('NomIndicador')->find($norma->idindicador);

                    $nuevanorma->idactividad = $idactividad;
                    $nuevanorma->cantbase = '1';
                    $nuevanorma->cantplanif = '1';
                    $nuevanorma->idindicador = $norma->idindicador;
                    $nuevanorma->idejercicio = $idejercicio;

                    $nuevanorma->version = 1;
                    $this->Insertar($nuevanorma);
                    $almacenados[] = $nuevanorma->toArray();
                }
            }
        }
        return $almacenados;
    }

    public function obtenerIndicadoresInvolucradosEnActividades(array $actividades)
    {

        $indicadores = array();
        $parcial = array();
        if (is_array($actividades)) {
            foreach ($actividades as $actividad) {
                $parcial = DatNorma::buscarIndicadoresInvolucradosEnActividad($actividad[0], false);
                $indicadores = array_merge($indicadores, $parcial);
                $parcial = array();
            }
        }
        /* se debe garantizar que no se repitan los idindicadores */
        $indicadores = $this->eliminarRepetidos($indicadores);
        return $indicadores;
    }

    private function eliminarRepetidos(array $arreglox)
    {
        $result = array();
        foreach ($arreglox as $value1) {
            $seencuentra = false;

            foreach ($result as $value2) {
                if ($value1 == $value2) {
                    $seencuentra = true;
                }
            }

            if ($seencuentra == false) {
                array_push($result, $value1);
            }
        }
        return $result;
    }

    public function duplicarNormas($idactorigen, $idnuevaactividad,$idejercicio)
    {
        $normas = DatNorma::buscarNormasPorEjercicio($idactorigen,$idejercicio);
        foreach ($normas as $valor) {
            $nuevanorma = new DatNorma();
            $nuevanorma->idactividad = $idnuevaactividad;
            $nuevanorma->idindicador = $valor['idindicador'];
            $nuevanorma->cantbase = $valor['cantbase'];
            $nuevanorma->cantplanif = $valor ['cantplanif'];
            $nuevanorma->idejercicio = $valor ['idejercicio'];

            /* temporal arrreglar la version en la BD ver a Drigsi para que elabore el trigger */
            $nuevanorma->version = 1;
            $this->Insertar($nuevanorma);
        }
        return true;
    }

    public function buscarNormas($idactividad, $idindicador)
    {
        return Doctrine_Query::create()
            ->from('DatNorma n')
            ->where('n.idactividad = ? AND n.idindicador = ?', array($idactividad, $idindicador))
            ->execute();
    }    public function buscarNormasEjercicios($idactividad, $idindicador,$idejercicio)
    {
        return Doctrine_Query::create()
            ->from('DatNorma n')
            ->where('n.idactividad = ? AND n.idindicador = ? AND n.idejercicio =?', array($idactividad, $idindicador,$idejecicio))
            ->execute();
    }

}

//fin clase
?>