<?php

  class ExpresionmatematicacompService extends ZendExt_Model
  {

    public function ExpresionmatematicacompService()
    {
      parent::ZendExt_Model();
    }

    //Servicio que devuelve todos los datos de las formulas dado un arreglo de idexpresionmatematica
    public function GetTodosporarrIdExpresionMatematica($arrIdexpresionmatematica)
    {
      $objExp = new DatExpresionmatematicaModel();
      return $objExp->GetTodosporarrIdExpresionMatematica($arrIdexpresionmatematica);
    }

    //Servicio que EVALUA una expresion matematica
    public function EvaluarExpresionMatematica($idexpresionmatematica, $arrIndicadoresValor)
    {
      $objExp = new DatExpresionmatematicaModel();
      return $objExp->EvaluarExpresionMatematica($idexpresionmatematica, $arrIndicadoresValor);
    }

    //Servicio que elimina una expresion matematica
    public function EliminarExpresionMatematica($idexpresionmatematica)
    {
      $objExp = new DatExpresionmatematicaModel();
      return $objExp->Eliminar($idexpresionmatematica);
    }

    public function GetIDIndicadoresporExpresionMatematica($idexpresionmatematica)
    {
      $objExp = new DatExpresionmatematicaModel();
      return $objExp->ObtenerIndicadoresporExpMat($idexpresionmatematica);
    }

    public function ReplicarExpresionMatematica($idexpresionmatematica)
    {

      $objExp              = new DatExpresionmatematica();
      $objExp1             = new DatExpresionmatematicaModel();
      $ExpresionMatematica = $objExp->buscarExpArray($idexpresionmatematica);
      $elementos           = DatElementoExpresionmatematica::GetTodosporExpresionMatematica($idexpresionmatematica);

      $idnuevaExpMat = $objExp1->insertarExpMat($ExpresionMatematica);
      $idnuevaElementosExpMat = $objExp1->insertarElementosExpMat($idnuevaExpMat, $elementos);

      return $idnuevaExpMat;

    }

    public function GetIndicadoresporArrayExpresionMatematica($arrIDsExpMat)
    {
      $objExp = new DatExpresionmatematicaModel();
      return $objExp->ObtenerIndicadoresporArrayExpMat($arrIDsExpMat);
    }

    /**
     * Funcion para guardar la una expresion matematica
     *
     * @param        $expresionamostrar
     * @param        $expresionacalcular
     * @param        $arrElementos
     * @param        $expresionamostrarconformato
     * @param string $denominacion
     * @param        $idexpresionmatematica
     *
     * @return mixed
     */
    public function guardarExpresionMatematica(
      $expresionamostrar, $expresionacalcular, $arrElementos, $expresionamostrarconformato, $denominacion = ' ',
      $idexpresionmatematica
    )
    {
      try {
        $objExpMatModel = new DatExpresionmatematicaModel();
        if (empty($idexpresionmatematica)) {

          if (!empty($denominacion)) {
            $objExpMat['denominacion'] = $denominacion;
          } else {
            $objExpMat['denominacion'] = '';
          }
          $objExpMat['expresionamostrar']          = $expresionamostrar;
          $objExpMat['expresionmostrarconformato'] = $expresionamostrarconformato;
          $objExpMat['expresionacalcular']         = $expresionacalcular;
          $id                                      = $objExpMatModel->insertarExpesionMatematica($objExpMat, $arrElementos);
        } else {
          $objExpMat                             = Doctrine::getTable('DatExpresionmatematica')->find($idexpresionmatematica);
          $objExpMat->denominacion               = $denominacion;
          $objExpMat->expresionamostrar          = $expresionamostrar;
          $objExpMat->expresionmostrarconformato = $expresionamostrarconformato;
          $objExpMat->expresionacalcular         = $expresionacalcular;
          $id                                    = $objExpMatModel->Actualizar($objExpMat, $arrElementos);
        }
        return $id;
      } catch (Exception $e) {
        if (DEBUG_ERP)
          die(__FILE__ . ' ' . __LINE__ . ' ' . $e->getMessage());
        return false;
      }
    }
    
    public function adicionarExpresionMatematica($arrExpresion, $arrElementos)
    {
      try {
        $objExpMatModel = new DatExpresionmatematicaModel();        
        return $objExpMatModel->Insertar($arrExpresion, $arrElementos);
      } catch (Exception $e) {
        if (DEBUG_ERP)
          die(__FILE__ . ' ' . __LINE__ . ' ' . $e->getMessage());
        return false;
      }
    }
    
    public function guardarTodosIndicadoresExpresionesMatematica(){
        $o = new DatExpresionmatematicaModel();
        $o->guardarIndicadoresTodasExpresiones();
    }
      public function guardarIndicadoresExpresionesMatematica($arrFormulas){
        $o = new DatExpresionmatematicaModel();
        $resp = $o->guardarIndicadoresExpresiones($arrFormulas);
		return $resp;
    }
    
    
  }

?>
