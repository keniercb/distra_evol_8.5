<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatObservacionesPdo extends BaseDatObservacionesPdo
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatElementos',
            array('local' => 'idelemento', 'foreign' => 'idelemento')
        );
    }

    /*public function Buscar($idobservaciones) {
        return Doctrine::getTable('DatObservacionesPdo')->find($idobservaciones);
    }

    public function GetTodos() {
        $query = new Doctrine_Query ( );
        $result = $query->from ( 'DatObservacionesPdo' )->execute ();
        return $result->toArray ();

    }

    public function GetPorLimite($limite = 10, $inicio = 0) {
        $query = new Doctrine_Query ( );
        $result = $query->from ( 'DatObservacionesPdo' )->limit 
      ( $limite )->offset ( $inicio )->execute ();
        return $result->toArray ();
    }

    public function GetObservacionesPorLimiteDadoIdElemento($limite = 10, 
     $inicio = 0, $idelemento) {
        $query = new Doctrine_Query ( );
        $result = $query->from ( 'DatObservacionesPdo' )->where('idelemento = ?', 
     $idelemento)->limit ( $limite )->offset ( $inicio )->execute ();
        return $result->toArray ();
    }

    public function GetCantoObs($idelemento) {
        $query = new Doctrine_Query ( );
        $result = $query->from ( 'DatObservacionesPdo' )->where 
     ( 'DatObservacionesPdo.idelemento = ?', $idelemento )->count ();
        return $result;
    }

    public function GetObsDadoIdElemen($idelemento) {
        $query = new Doctrine_Query ( );
        $result = $query->from ( 'DatObservacionesPdo obs' )
        ->where ( 'obs.idelemento = ?', $idelemento )
        ->execute ();
        return $result->toArray ();
    }

    public function GetObsDadoIdObs($idobs) {
        $query = new Doctrine_Query ( );
        $result = $query->select ( 'obs.asunto, obs.cuerpo, obs.idusuariocrea' )
      ->from ( 'DatObservacionesPdo obs' )->where ( 'obs.idobservaciones = ?',
      $idobs )->setHydrationMode ( Doctrine::HYDRATE_ARRAY )->execute ();
        return $result;
    }

    public function EliminarObservPorIdElemento($id_elemento) {
        $query = new Doctrine_Query ( );
        $query->delete ( 'DatObservacionesPdo' )->from ( 'DatObservacionesPdo 
     obs' )->where ( 'obs.idobservaciones = ?', $id_elemento )->execute ();
    }

    public function cantidadObservaciones($idelemento) {
        $query = new Doctrine_Query ( );
        $result = $query->from ( 'DatObservacionesPdo' )->where('idelemento = 
     ?', $idelemento)->count ();
        return $result;
    }
    */


    /*
    *
    *consulta para buscar las observaciones para un determinado elemento
    */
    public function GetObsDadoIdElemen($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatObservacionesPdo obs')
            ->where('obs.idelemento = ?', $idelemento)
            ->execute();
        return $result->toArray();
    }


    /*
    *
    *consulta para buscar las observaciones con el mismo asunto para un determinado elemento
    */
    public function GetObsMismoDenUserElem($asunto, $idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatObservacionesPdo o')->where(
            "o.asunto = '$asunto' AND o.idelemento = '$idelemento'"
        )->execute();
        return $result->toArray();
    }
} //fin clase 



