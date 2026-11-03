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

    public function listarNormasPorActividad($params)
    {
        $data = DatNorma::listarNormasPorActividad($params);
        return $data;
    }

    public function adicionarNormas($params)
    {
        $almacenados = 0;

        foreach ($params['normas'] as $norma) {
            $normaConIndicador = DatNormaModel::buscarNormasEjercicios($params['idactividad'], $norma->idindicador, $params['idejercicio'])->getFirst();
            if ($normaConIndicador->idnorma == null) {
                $nuevanorma = new DatNorma();
                if (is_object($nuevanorma)) {
                    $nuevanorma->idactividad = $params['idactividad'];
                    $nuevanorma->cantbase = '1';
                    $nuevanorma->cantplanif = '1';
                    $nuevanorma->idindicador = $norma->idindicador;
                    $nuevanorma->idejercicio = $params['idejercicio'];
                    $nuevanorma->idusuario = $params['idusuario'];
                    $nuevanorma->version = 1;
                    $nuevanorma->save();
                    $almacenados++;
                }
            }
        }

        return $almacenados;
    }
   

    public function eliminarNorma($params)
    {
        $idnormas_array = array();

        foreach ($params['normas'] as $norma) {
            $idnormas_array [] = $norma->idnorma;
        }
        $idnormas = implode(',', $idnormas_array);
        DatNorma::eliminarNorma($idnormas);

        return count($idnormas);
    }

    public function modificarNorma($params)
    {
        $modificados = 0;
        $fechaActual = date("d-m-Y H:i:s");

        foreach ($params['normas'] as $norma) {
            $normamod = Doctrine::getTable('DatNorma')->find($norma->idnorma);
            if (is_object($normamod)) {
                $normamod->cantplanif = ($norma->cantplanif != null) ? $norma->cantplanif : '1';
                $normamod->cantbase = ($norma->cantbase != null) ? $norma->cantbase : '1';
                $normamod->idusuario = $params['idusuario'];
                $normamod->fecha = $fechaActual;
                $normamod->save();
                $modificados++;
            }
        }

        return $modificados;
    }

    /* METODOS PENDIENTES A REVISAR */

    public function duplicarNormas($params, $idactorigen, $idnuevaactividad, $idejercicio)
    {

        $normas = DatNorma::buscarNormasPorEjercicio($idactorigen, $idejercicio);
        foreach ($normas as $valor) {
            $nuevanorma = new DatNorma();
            $nuevanorma->idactividad = $idnuevaactividad;
            $nuevanorma->idindicador = $valor['idindicador'];
            $nuevanorma->cantbase = $valor['cantbase'];
            $nuevanorma->cantplanif = $valor ['cantplanif'];
            $nuevanorma->idejercicio = $valor ['idejercicio'];
            $nuevanorma->idusuario = $valor['idusuario'];
            $nuevanorma->version = 1;
            $this->Insertar($nuevanorma);
            /*$reglas = new DatRegla();
            $result = $reglas->getNormaById($valor);
             foreach ($result as $regla) {

                 $nuevaregla = new DatRegla();
                 $nuevaregla->idnorma = $regla['idnorma'];
                 $nuevaregla->denominacion = $regla->denominacion;
                 $nuevaregla->valorcontrol = $regla['valorcontrol'];
                 $nuevaregla->nivelactividadbase = $regla['nivelactividadbase'];
                 $nuevaregla->idactividadorigen = $idnuevaactividad;
                 $nuevaregla->idactividaddestino = $regla['idactividaddestino'];
                 $nuevaregla->idejercicio = $idejercicio;
                 $nuevaregla->idusuario = $params['idusuario'];
                 $this->Insertar($nuevaregla);
             }*/
        }
        return true;
    }


    public function duplicarReglas($params, $idactorigen, $idnuevaactividad, $idejercicio)
    {

        $reglas = DatRegla::buscarReglaByDuplicar($idactorigen, $idejercicio);

        foreach ($reglas as $valor) {
            $nuevaregla = new DatRegla();

            //   $nuevaregla->idnorma = $valor['idnorma'];
            /*  $nuevaregla->denominacion = $valor['denominacion'];
              $nuevaregla->valorcontrol = $valor['valorcontrol'];
              $nuevaregla->nivelactividadbase = $valor['nivelbase'];
              $nuevaregla->idactividadorigen = $idnuevaactividad;
              $nuevaregla->idactividaddestino = $params['idactividaddestino'];
              $nuevaregla->idejercicio = $params['idejercicio'];
              $nuevaregla->idusuario = $params['idusuario'];
              $$this->Insertar($nuevaregla);*/
        }
        return true;
    }

    public function buscarNormas($idactividad, $idindicador)
    {
        return Doctrine_Query::create()
            ->from('DatNorma n')
            ->where(
                'n.idactividad = ? AND n.idindicador = ?', array($idactividad, $idindicador)
            )
            ->execute();
    }
    

    public function buscarNormasEjercicios($idactividad, $idindicador, $idejercicio)
    {
        return Doctrine_Query::create()
            ->from('DatNorma n')
            ->where(
                'n.idactividad = ? AND n.idindicador = ? AND n.idejercicio =?', array($idactividad, $idindicador, $idejercicio)
            )
            ->execute();
    }

    public function cargarUsuarios()
    {
        return DatNorma::cargarUsuarios();
    }

}

//fin clase
