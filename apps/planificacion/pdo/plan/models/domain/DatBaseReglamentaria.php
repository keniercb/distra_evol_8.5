<?php

class DatBaseReglamentaria extends BaseDatBaseReglamentaria
{

    public function setUp()
    {
        parent:: setUp();
    }



    public function guardar($parametros){

        $consulta
                = "DELETE FROM mod_objetivos.dat_basereglamentaria b
          WHERE b.nombrearchivo = '$parametros->nombrearchivo'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);

        $result = $res->fetchAll();

        $objDatBaseReglamentaria=new DatBaseReglamentaria();
        $objDatBaseReglamentaria->denominacion=$parametros->denominacion;
        $objDatBaseReglamentaria->nombrearchivo=$parametros->nombrearchivo;
        $objDatBaseReglamentaria->fechacreacion=$parametros->fechacreacion;
        $objDatBaseReglamentaria->idautor=$parametros->idautor;
        $objDatBaseReglamentaria->save();
        return count($result);
    }

  public function eliminar($parametros){
    $ids="";
    foreach ($parametros->idselementos as $value){
      $ids.=($ids=="")?$value:",".$value;
    }

    $select_file=" SELECT 
                      nombrearchivo
                    FROM 
                      mod_objetivos.dat_basereglamentaria where idbase in (".$ids.") ";

    $consulta
      = " DELETE FROM 
                          mod_objetivos.dat_basereglamentaria
                        WHERE 
                          idbase in (".$ids.");  ";

    //print_r($consulta);die;
    $connA = Doctrine_Manager:: connection();
    $res = $connA->execute($select_file);
    $res1 = $connA->execute($consulta);
    $result = $res->fetchAll();
    return $result;

    }


    public function nombreArchivos($parametros){
    $ids="";
    foreach ($parametros->idselementos as $value){
      $ids.=($ids=="")?$value:",".$value;
    }

    $select_file=" SELECT 
                      nombrearchivo
                    FROM 
                      mod_objetivos.dat_basereglamentaria where idbase in (".$ids.") ";


    //print_r($consulta);die;
    $connA = Doctrine_Manager:: connection();
    $res = $connA->execute($select_file);
    $result = $res->fetchAll();
    return $result;

  }

}

