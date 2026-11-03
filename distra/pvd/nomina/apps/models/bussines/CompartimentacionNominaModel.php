<?php

class CompartimentacionNominaModel extends ZendExt_Model
{

    private $dirFolderComp;
    private $dirFileComp;
    private $referencia;
    private $arrayPersonasPago;
    private $arraySumAreas;

    public function CompartimentacionNominaModel($referencia)
    {
       // print_r($idconfiguracion);die;
        $nombre =ucwords($referencia);
       //print_r($nombre);die;
        parent::ZendExt_Model();
        $this->referencia = $nombre;
        $register = Zend_Registry::getInstance();
        $this->dirFolderComp = $register->config->modulo_path .
            '/models/bussines';
        $this->dirFileComp = $this->dirFolderComp. '/Calculo'.$nombre.'.php';
    }

    public function getDataFile() {
        if (file_exists($this->dirFileComp)) {
            return file_get_contents($this->dirFileComp);
        }else{
            return $this->createFileCompartimentacion();
        }
    }

    public function createFileCompartimentacion() {

    $arrayPersonasPago =('arrayPersonasPago');
    $arraySumAreas ='arraySumAreas';
        //Genera el fichero PHP de compartimentacion
        $string = '<?php
/*
* Author: Milena Gainza Rodríguez
* Version: 2.0
* Description:
*
* Este fichero se utiliza por la clase

*/

class Calculo'.$this->referencia.' extends ZendExt_Model {
    //Arreglo que contiene los principales elementos de interes del pago
    public  $arrayDetalles;
    public $arrayPersonasNopago;
    function __construct(){
         $this->arrayDetalles=Array();
         $this->arrayPersonasNopago=Array();
    }

public function Calcular($arrayPersonaValores,$indicadoresPago,$personasPorAreas,$montosPorAreas)
{

   //Realizando la primera parte del calculo
   $varAux=$this->CalculoPrimPartIDSSumPorAreas($arrayPersonaValores,$personasPorAreas);
    $arrayPersonasPago = $varAux['.$arrayPersonasPago.'];
    $arraySumAreas = $varAux['.$arraySumAreas.'];
    return $this->calcularSPRPorCadaTrabajador($arrayPersonasPago,$arraySumAreas,$montosPorAreas);

}

  public function dameDetallesPago(){
    return $this->arrayDetalles;
}
 public function damePersonasExcluidas(){
        return $this->arrayPersonasNopago;
  }
}
';

        file_put_contents($this->dirFileComp, $string);
        return $string;
}

    public function saveFile($code) {

        if (file_exists($this->dirFileComp)) {
           // print_r($this->dirFileComp);die;
            file_put_contents($this->dirFileComp, $code);
            return true;
        }
    }
}
