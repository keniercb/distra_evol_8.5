<?php

//$wsld = 'http://sipac-calidad.prod.xetid.cu/planificacion/pdo/plan/services/webservices/server.wsdl.php';
//$wsld = 'https://gestion-empresarial.xetid.cu/planificacion/pdo/plan/services/webservices/servicio.wsdl.php';


if(isset($_GET['user']) && !isset($_GET['actividades'])){
    $parray['user'] = $_GET['user'];
    $parray['pass'] =$_GET['pass'];
    $parray['fechainicio'] =$_GET['finicio'];
    $parray['fechafin'] =$_GET['ffin'];

    try {
//        $soap = new SoapClient('https://gestion-empresarial.xetid.cu/planificacion/pdo/plan/services/webservices/servicio.wsdl', array('soap_version'=> SOAP_1_1));
        $soap = new SoapClient('http://sipac-calidad.prod.xetid.cu/planificacion/pdo/plan/services/webservices/servicio.wsdl',
            array('encoding'=>'UTF-8'));
        $result = $soap->obtenerActividades($parray);
        echo $result;
    } catch (Exception $S) {
        print_r($S->getMessage());die;
    };
}


if(isset($_GET['user']) && isset($_GET['actividades'])){
    $parray1['user'] =       $_GET['user'];
    $parray1['pass'] =       $_GET['pass'];
    $parray1['fechainicio'] =$_GET['finicio'];
    $parray1['fechafin'] =   $_GET['ffin'];
    $parray1['actividades'] =$_GET['actividades'];
    try {
        $soap = new SoapClient('http://sipac-calidad.prod.xetid.cu/planificacion/pdo/plan/services/webservices/servicio.wsdl', array('trace' => true));
        $result1 = $soap->adicionarActividad($parray1); //Se envia 1 para despues enviar 1 mision;
        if($result1==1){
            $result2 = $soap->obtenerActividades($parray1);
            echo $result2;
        }else if($result1==-1){
            echo json_encode(array('total' => -1, 'resultado' => []));
        }else {
            echo json_encode(array('total' => -2, 'resultado' => []));
        }
//        echo json_encode(array('total' => -2, 'resultado' => []));

    } catch (Exception $S) {
//        echo "Error";
        print_r($S->getMessage()."---".$S->getTraceAsString());die;
    };
}

