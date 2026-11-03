<?php

/**
 * Created by PhpStorm.
 * User: Miguel Antonio
 * Date: 10/11/2015
 * Time: 04:05 PM
 */
class SyncpersonasactivosModel extends ZendExt_Model
{


    protected $response;

    function  __construct()
    {

    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function syncactivoFAR($result, $config)
    {
        //Servicio de metadatos
        //obtenerUbicacion
        // $result = utf8_decode($result);

        $collection = new Doctrine_Collection('DatPersona');

        foreach ($result as $k => $v) {
            $collection[$k]->nombre = $v['nombre'];
            $collection[$k]->papel = $v['papell'];
            $collection[$k]->sapel = $v['sapell'];
            $collection[$k]->sexo = $v['sexo'];
            $collection[$k]->idpers = $v['idpers'];/*
            $collection[$k]->DatDocidentidad = Utiles::linkCollectionToSave($collection[$k]->DatDocidentidad, array(
                'idtipodocidentidad' => $v['tipoci'] === 0 ? 1 : 2,
                'numero' => $v['noidentidad'],
                'principal' => 1
            ));*/

            /*  $collection[$k]->DatOcupacion = Utiles::linkCollectionToSave($collection[$k]->DatOcupacion, array(
                  'identidad' => $v['idestructura'],
                  'idarea' => $v['idarea'],
                  'area' => $v['denarea'],
                  'area' => $v['denarea'],
                  'cargo' => $v['cargo'],
                  'numero' => $v['ordennombramiento'],
                  'fdesde' => date('d/m/Y')
              ));*/

        }
        $collection->save();
        try {

            // return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}