<?php


class DatNomEspecialidad extends BaseNomEspecialidad
{

    public function NOMEsp($id)
    {
        try {

            $query = Doctrine_Query::create()
                ->from('NomEspecialidad')
                ->where('idespecialidad = ?', $id)
                ->fetchArray();
            echo '<pre>';
            var_dump($query);die;


//            $mg = Doctrine_Manager::getInstance();
//            $conn = $mg->getCurrentConnection();
//
//            $sqlespecialidad="SELECT DISTINCT  ne.denespecialidad  FROM mod_datosmaestros.nom_especialidad ne
//                           .
//WHERE ne.idespecialidad = ".$id;
////        print_r($sqlespecialidad);die;
//            $esp = $conn->fetchAll($sqlespecialidad);
        }
        catch (Exception $e){
            var_dump($e);die;
        }
        $final=$esp[0]['denespecialidad'];
        return $final;
    }

}