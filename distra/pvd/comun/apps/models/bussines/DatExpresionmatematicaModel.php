<?php

  class DatExpresionmatematicaModel extends ZendExt_Model
  {

    public function DatExpresionmatematicaModel()
    {
      parent::ZendExt_Model();
    }

    public function Insertar(array $expresionMat, $arrElementos)
    {
      try {
        $objDomain = new DatExpresionmatematica();
        foreach ($expresionMat as $k => $v) {
          $objDomain->$k = $v;
        }
        $objDomain->save();
        $objElemExpMat = new DatElementoExpresionmatematicaModel();
        $objElemExpMat->ActualizarElementos($objDomain->idexpresionmatematica, $arrElementos);
        return $objDomain->idexpresionmatematica;
      } catch (Doctrine_Exception $e) {
        throw $e;
      }
    }

    public function Actualizar(array $expresionMat, $arrElementos)
    {
      try {
        $objDomain = Doctrine::getTable('DatExpresionmatematica')->find($expresionMat['idexpresionmatematica']);
        if ($objDomain) {
          foreach ($expresionMat as $k => $v) {
            $objDomain->$k = $v;
          }

          $objDomain->save();
          $objElemExpMat = new DatElementoExpresionmatematicaModel();
          $objElemExpMat->EliminarElementos($objDomain->idexpresionmatematica);
          $objElemExpMat->ActualizarElementos($objDomain->idexpresionmatematica, $arrElementos);
          return $objDomain->idexpresionmatematica;
        } else {
          throw new Exception('La expresion no existe', 3);
        }
      } catch (Doctrine_Exception $e) {
        throw $e;
      }
    }

    public function Eliminar($id)
    {
      try {
        Doctrine_Query::create()
          ->delete()
          ->from('DatExpresionmatematica')
          ->where('idexpresionmatematica = ?', $id)
          ->execute();

        return true;
      } catch (Doctrine_Exception $e) {
        $this->conn->rollback();
        throw $e;
      }
    }

    public function BuscarExpresionMatematica($idExpresionMatematica)
    {
      $objExpMat = new DatExpresionmatematica();
      return $objExpMat->Buscar($idExpresionMatematica);
    }

    /**
     * Funcion que evalua una expresion matematica
     * ---------------------------------------------
     * 23 de Mayo de  2016 |   Persona
     * @autor   Centro Capital Humano - Ing. Yadir Martinez Vergara
     * @version 1.5.0
     */
    public function EvaluarExpresionMatematica($idexpresionmatematica = NULL, $arrIndicadoresValor, $expresionacal = NULL)
    {
      $r                  = new stdClass();
      $expresionacalcular = $expresionacal;
      if ($idexpresionmatematica != NULL) {
        $objExpMat  = new DatExpresionmatematica();
        $objBuscado = $objExpMat->Buscar($idexpresionmatematica);
        if (empty($objBuscado)) {
          $r->codigo = 3;
          $r->error  = "No existe la expresi&oacute;n matem&aacute;tica.";
          return $r;
        }
        $expresionacalcular = $objBuscado->expresionacalcular;
      }
      
      /*Busco los indicadores dentro de la expresion matematica y compruebo que esten todos*/
      /*Reemplaza los indicadores por sus valores*/
      foreach ($arrIndicadoresValor as $i => $v) {
        $ind = 'I' . $v['idindicador'];
        /*Tiene en cuenta la exactitud de la variable*/
        $expresionacalcular = preg_replace_callback(
          '/' . $ind . '(\D|\Z)/',
          function ($matches) use ($v) {
            return $v['valor'] . $matches[1];
          },
          $expresionacalcular
        );
      }

      /*Reemplaza los operadores condicionales*/
      $expresionacalcular = str_replace('SI_', ' if( ', $expresionacalcular);
      $expresionacalcular = str_replace('ENTONCES', ' ) ', $expresionacalcular);
      $expresionacalcular = str_replace('SINO', ' else ', $expresionacalcular);
      $expresionacalcular = str_replace('DEVOLVER', " \$resultadoexpresion = ", $expresionacalcular);

      /*Compruebo si quedaron indicadores sin reemplazar por su valor*/
      $pos = strpos($expresionacalcular, 'I');
      if ($pos === FALSE) {

        /*Si me encuentro el operador if la expresion no se considera booleana y la expresion no es lineal*/
        $esLineal = 1;
        if (strpos($expresionacalcular, 'if') !== FALSE) {
          $esbooleana = 0;
          $esLineal   = 0;
        }

        /*Evaluo la expresion matematica y almaceno en la variable $resultadoexpresion el valor*/

        try {
          /*Desabilito todos los errores*/
          error_reporting(0);
          if ($esLineal == 1)
            $expresionacalcular = "\$resultadoexpresion = " . $expresionacalcular . " ;";
          else
            $expresionacalcular = "\$resultadoexpresion = NULL; " . $expresionacalcular;
          $resultado = eval($expresionacalcular);
          /*Si la funcion eval devuelve falso es que hubo error sino la expresion está bien*/
          if ($resultado === false) {
            $r->codigo   = 3;
            $r->booleana = 0;
            $r->error    = "Error de sintaxis en la expresión a evaluar.";
            return $r;
          }
        } catch (Exception $e) {
          throw $e;
        }

        $r->codigo             = 1;
        $r->expresionacalcular = $expresionacalcular;
        $r->valor              = $resultadoexpresion;

        /*
         * El valor a devolver siempre va a ser un objeto y con valor numérico
         * codigo: 1 ok, 3 error
         * booleana: 0 no, 1 si
         * valor: numero
         * error: Mensaje del error
         */
        return $r;
      } else {
        $r->codigo   = 3;
        $r->booleana = 0;
        $r->error    = "Existe(n) " . substr_count($expresionacalcular, 'I') . " indicador(es) que no se encuentra(n) en la expresi&oacute;n matem&aacute;tica.";
      }
    }

    /**
     * Funcion que valida una expresion matematica
     * ---------------------------------------------
     * 23 de Mayo de  2016 |   Persona
     * @autor   Centro Capital Humano - Ing. Yadir Martinez Vergara
     * @version 1.5.0
     */
    public function ValidarExpresionMatematica($expresionacalcular, $arrElementos)
    {
      foreach ($arrElementos as $v) {
        if ($v['tipo'] == 6) {
          $expresionacalcular = str_replace($v['valor'], '31', $expresionacalcular);
        }
      }

      $expresionacalcular = str_replace('SI_', ' if( ', $expresionacalcular);
      $expresionacalcular = str_replace('ENTONCES', ' ) ', $expresionacalcular);
      $expresionacalcular = str_replace('SINO', ' else ', $expresionacalcular);
      $expresionacalcular = str_replace('DEVOLVER', " \$resultadoexpresion = ", $expresionacalcular);

      /*Compruebo si la expresion es lineal o contiene condicionales*/
      $esLineal = 1;
      if (strpos($expresionacalcular, 'if') !== FALSE)
        $esLineal = 0;

      $m         = new stdClass();
      $m->codigo = 1;

      if ($esLineal == 1)
        $m->expresionacalcular = "\$resultadoexpresion = " . $expresionacalcular . " ;";
      else
        $m->expresionacalcular = "\$resultadoexpresion = NULL; " . $expresionacalcular;

      try {
        /*Desabilito todos los errores*/
        error_reporting(0);
        $r = eval($m->expresionacalcular);
        /*Si la funcion eval devuelve falso es que hubo error sino la expresion está bien*/
        if ($r === false) {
          $m->codigo = -1;
        }
        return $m;
      } catch (Exception $e) {
        $m->codigo = -1;
        return $m;
      }


    }

    /* Devuelve los datos de las expresiones matematicas dado un arreglo de id de expresiones matematicas */
    public function GetTodosporarrIdExpresionMatematica($arrIdexpresionmatematica)
    {
      $objExpMat = new DatExpresionmatematica();
      return $objExpMat->GetTodosporarrIdExpMat($arrIdexpresionmatematica);
    }

    public function ObtenerIndicadoresporExpMat($idexpresionmatematica)
    {
      $dir = $_SERVER ['DOCUMENT_ROOT'] . "/pvd/comun/indicadoresexpresonmatematica/{$idexpresionmatematica}.iem";
      $fp  = fopen($dir, "r");
      if ($fp == FALSE)
        return array();
      $contenido = fread($fp, filesize($dir));
      $s         = unserialize($contenido);
      return $s;
    }

    public function ObtenerIndicadoresporArrayExpMat($arrIdsExpMat)
    {
      $arrIndicadores = array();
      foreach ($arrIdsExpMat as $a) {
        $dir = $_SERVER ['DOCUMENT_ROOT'] . "/pvd/comun/indicadoresexpresonmatematica/{$a}.iem";
        $fp  = fopen($dir, "r");
        if ($fp != FALSE) {
          $contenido          = fread($fp, filesize($dir));
          $arrIndicadores[$a] = unserialize($contenido);
        }
        fclose($f);
      }

      return $arrIndicadores;
    }

    public function insertarExpesionMatematica(array $objExpMat, array $arrElementos)
    {
      try {

        $collection = new Doctrine_Collection('DatExpresionmatematica');
        foreach ($objExpMat as $k => $v) {
          $collection[0]->$k = $v;
        }

        foreach ($arrElementos as $k => $v) {
          $collection[0]->DatElementoExpresionmatematica[$k]->elemento     = $v->valor;
          $collection[0]->DatElementoExpresionmatematica[$k]->tipoelemento = $v->tipo;
          $collection[0]->DatElementoExpresionmatematica[$k]->valormostrar = $v->valormostrar;

          if ($v->tipo == 6) {
            $arr                                                            = explode('I', $v->valor);
            $collection[0]->DatElementoExpresionmatematica[$k]->idindicador = $arr[1];
          } else {
            $collection[0]->DatElementoExpresionmatematica[$k]->idindicador = 0;
          }
          $collection[0]->DatElementoExpresionmatematica[$k]->orden = $k;
        }

        $collection->save();
        return $collection[0]->idexpresionmatematica;
      } catch (Doctrine_Exception $e) {
        throw $e;
      }
    }


    public function insertarExpMat($expresionMat)
    {
      try {
//        print_r($expresionMat);  die;
        $objDomain               = new DatExpresionmatematica();
        $objDomain->denominacion = (!$expresionMat[0]['denominacion']) ? $expresionMat[0]['denominacion'] : "'"."'";

        $objDomain->expresionamostrar          = $expresionMat[0]['expresionamostrar'];
        $objDomain->expresionmostrarconformato = $expresionMat[0]['expresionmostrarconformato'];
        $objDomain->expresionacalcular         = $expresionMat[0]['expresionacalcular'];

        $objDomain->save();

        return $objDomain->idexpresionmatematica;

      } catch (Doctrine_Exception $e) {
        throw $e;
      }
    }

    public function insertarElementosExpMat($idnuevaExpMat, $elementos)
    {
      try {
        $objDomain = new DatElementoExpresionmatematica();

        for ($i = 0; $i < count($elementos); $i++) {
          $objDomain->idexpresionmatematica = $idnuevaExpMat;
          $objDomain->elemento              = $elementos[$i]['elemento'];
          $objDomain->tipoelemento          = $elementos[$i]['tipoelemento'];
          $objDomain->idindicador           = $elementos[$i]['idindicador'];
          $objDomain->orden                 = $elementos[$i]['orden'];
          $objDomain->valormostrar          = $elementos[$i]['valormostrar'];
          $objDomain->save();
//          print_r($objDomain);die;
        }
        return $objDomain->idexpresionmatematica;
      } catch (Doctrine_Exception $e) {
        throw $e;
      }
    }
    
    public function guardarIndicadoresTodasExpresiones(){
      $sql = "SELECT idelementoexpresionmatematica, idexpresionmatematica, elemento, 
                    tipoelemento, idindicador, orden, valormostrar
               FROM mod_utiles.dat_elementoexpresionmatematica
               WHERE tipoelemento = 6;";
       $mg = Doctrine_Manager::getInstance();
       $conn = $mg->getCurrentConnection();
       $result = $conn->fetchAll($sql); 
       
       $arrIdsExp = array();
       foreach($result as $r){
            $arrIdsExp[] = $r['idexpresionmatematica'];
       }
       
       $arrIdsExp = array_unique($arrIdsExp);
       
       $dir = $_SERVER ['DOCUMENT_ROOT'] . "/pvd/comun/indicadoresexpresonmatematica/";
        
       
       foreach($arrIdsExp as $em){
           $arrInd = array();
           foreach($result as $r){
               if($r['idexpresionmatematica'] == $em){
                   $arrInd[] = $r['idindicador'];
               }
           }
           if(!empty($arrInd)){
                $fp  = fopen($dir.$em.".iem", "w");
                fclose($fp);
                $contenido = serialize($arrInd);
                file_put_contents($dir.$em.".iem", $contenido);
           }
       }
       
    }
	
	public function guardarIndicadoresExpresiones($arrFormulas){
          $sql = "SELECT idelementoexpresionmatematica, idexpresionmatematica, elemento,
                    tipoelemento, idindicador, orden, valormostrar
               FROM mod_utiles.dat_elementoexpresionmatematica
               WHERE tipoelemento = 6 AND idexpresionmatematica IN (".implode(',', $arrFormulas).");";
          $mg = Doctrine_Manager::getInstance();
          $conn = $mg->getCurrentConnection();
          $result = $conn->fetchAll($sql);

          $arrIdsExp = array();
          foreach($result as $r){
              $arrIdsExp[] = $r['idexpresionmatematica'];
          }

          $dir = $_SERVER ['DOCUMENT_ROOT'] . "/pvd/comun/indicadoresexpresonmatematica/";

          foreach($arrFormulas as $em){
              $arrInd = array();
              foreach($result as $r){
                  if($r['idexpresionmatematica'] == $em){
                      $arrInd[] = $r['idindicador'];
                  }
              }
              if(!empty($arrInd)){
                  $fp  = fopen($dir.$em.".iem", "w");
                  fclose($fp);
                  $contenido = serialize($arrInd);
                  file_put_contents($dir.$em.".iem", $contenido);
              }
          }
		  return 'ok';

      }
    
    
  }
  
  
   

?>