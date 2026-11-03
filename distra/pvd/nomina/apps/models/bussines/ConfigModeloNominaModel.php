<?php

/**
 * Modelo de negocio para gestionar configuración de los modelos de nomina.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Modelo de negocio
 * @uses ConfigModeloNomina, Entidad valor de configuracion de modelos de nomina (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class ConfigModeloNominaModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function ConfigModeloNominaModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener el listado de configuracion de modelos de nominas
     * 
     * @return array Listado de configuracion de modelos de nominas.
     */
    public function getNomCategorias() {

        //Retornando el listado de configuracion de modelos de nomina.
        $result = ConfigModeloNomina::getNomCategorias();

        return $result;
    }

    /**
     * Obtener el listado de configuracion de modelos de nominas
     *
     * @return array Listado de configuracion de modelos de nominas.
     */
    public function obtenerConfigModelosNomina() {

        //Retornando el listado de configuracion de modelos de nomina.
        $result = ConfigModeloNomina::obtenerConfigModelosNomina();

        foreach ( $result as $key => $value) {

           // $ioc = ZendExt_Ioc_Inter::getInstance();
            $cat = ConfigModeloNominaCategoria::obtenerCategoriasPorIdModelo($value['idconfmodelonomina']);
            $aux = array();
            $categoriasString = '';
            foreach ($cat as $llave => $valor) {

                $aux [$llave]= $valor['idcategoria'];
                $auxcat = ConfigModeloNominaCategoria::getNomCategoriasdadoid($valor['idcategoria']);
               // print_r($auxcat);die;
                //$auxcat = $ioc->persona->getNomCategoriaById($valor['idcategoria']);
                //print_r($auxcat);die;
                //$auxcat = $ioc->pvd->getNomCategoriaById($valor['idcategoria']);
                //$auxcat = $this->pIntegrator->persona->getNomCategoriaById($valor['idcategoria']);
				//print_r($auxcat);die;
                if($categoriasString == '' && count($auxcat)>0){
                     $categoriasString .= $auxcat[0]['denominacion'];
                }/*else{
                    $categoriasString .= ' -- '.((count($auxcat)>0)?$auxcat[0]['denominacion']:'');
                }*/
            }

            $result[$key]['arrayCateg'] = $aux;
            $result[$key]['categorias'] = $categoriasString;

        }
        return $result;
    }

    /**
     * Insertar una configuración de modelo de nomina.
     * 
     * @param int $idtiponom         	Identificador del tipo de nómina.
     * @param int $idtipopago         	Identificador del tipo de pago.
     * @param array $arrayCateg         Arreglo de categorías.
     */
    public function adicionarConfigModeloNomina($idtiponom, $idtipopago, $arrayCateg) {

        //Se crea el objeto de la configuración.
        $objConfig = new ConfigModeloNomina();

        //Insertando los datos.
        $objConfig->idtipopago = $idtipopago;
        $objConfig->idtiponomina = $idtiponom;
		
        //Guardando los datos.
        $objConfig->save();

        foreach ($arrayCateg as $key => $value) {
            //Se crea el objeto de la configuración de modelo categoria.
            $objConfigCat = new ConfigModeloNominaCategoria();

            $objConfigCat->idconfmodelonomina = $objConfig->idconfmodelonomina;
            $objConfigCat->idcategoria = $value;

            $objConfigCat->save();
        }
    }

    /**
     * Modificar una configuración de modelo de nomina.
     * 
     * @param int $idconf        		Identificador de la configuración.
	 * @param int $idtiponom         	Identificador del tipo de nómina.
     * @param int $idtipopago         	Identificador del tipo de pago.
     * @param array $arrayCateg         Arreglo de categorías.
     */
    public function modificarConfigModeloNomina($idconf, $idtiponom, $idtipopago, $arrayCateg) {

        //Obteniendo la configuración a modificar.
        $objConfig = ConfigModeloNomina::obtenerObjConfigModelosNominaDadoId($idconf);

        //Modificando los datos de la configuración.
		$objConfig->idtipopago = $idtipopago;
        $objConfig->idtiponomina = $idtiponom;
        
        //Guardando los datos.
        $objConfig->save();

        //Eliminar todas las categorías.
        ConfigModeloNominaCategoria::eliminarTodasCategoriasDadoIdModelo($idconf);

        foreach ($arrayCateg as $key => $value) {
            //Se crea el objeto de la configuración de modelo categoria.
            $objConfigCat = new ConfigModeloNominaCategoria();

            $objConfigCat->idconfmodelonomina = $objConfig->idconfmodelonomina;
            $objConfigCat->idcategoria = $value;
 
            $objConfigCat->save();
        }
    }
}