<?php

class DatContrato extends BaseDatContrato {
    
    public function setUp() {
        parent::setUp();
    }
    
    public function adicionarContrato($parametros){
        $newcontrato = new DatContrato();
        $newcontrato->nocontrato = $parametros ['nocontrato'];
        $newcontrato->fechacontratacion = $parametros ['fechacontrat'];
        $newcontrato->totalcontratado = $parametros['totalcont'];
        $newcontrato->idsolicitud711 = $parametros['idsolicitud711'];
        $newcontrato->iddatosproveedor = ($parametros['iddatosproveedor'] == "") ? NULL : $parametros['iddatosproveedor'];
        //$newcontrato->ratecambio = $parametros['iddirector']; ($parametros['idespecialistacs'] == "") ? NULL : $parametros['idespecialistacs']; 
        $newcontrato->save();
        Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
        return $newcontrato;
    }
    
    public function modificarContrato($parametros){
        $conn = Doctrine_Manager::connection();
        $iddatosproveedor = ($parametros['iddatosproveedor'] == "") ? 'NULL' : $parametros['iddatosproveedor'];
        
            $sqlupd = "UPDATE mod_plan711.dat_contrato
                        SET totalcontratado={$parametros['totalcont']}, iddatosproveedor = $iddatosproveedor
                      WHERE  idcontrato = {$parametros['idcontrato']}";
            $conn->execute($sqlupd); 
            
            $sqlinsert = "DELETE FROM mod_plan711.dat_solicitudfuentesf
                        WHERE idsolicitud711 = {$parametros['idsolicitud711']} and idcontrato = {$parametros['idcontrato']}";
            $conn->execute($sqlinsert);
            Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
        
        return 1;
    }
    
    public function listarContrato($parametros){
        $conn = Doctrine_Manager::connection();
        $addWhere = "and true";
        $sql ="SELECT idcontrato, fechacontratacion, totalcontratado, idsolicitud711, 
                        ratecambio, nocontrato,iddatosproveedor, denominacion as proveedor
                FROM mod_plan711.dat_contrato
                left JOIN mod_planificacion.nom_datosnomenclador idpp ON (mod_plan711.dat_contrato.iddatosproveedor = idpp.iddatosnomenclador)
                      where idsolicitud711={$parametros['idsolicitud711']}";
        
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarContratoPlanEntidad($parametros){
        $conn = Doctrine_Manager::connection();
        $addWhere = "and true";
        if ($parametros['idempimp']) {
            $addWhere .= " AND dat_solicitud711.iddatosempimp = {$parametros['idempimp']}";
        }
        if ($parametros['idcc']) {
            $addWhere .= " AND dat_solicitud711.iddatoscc = {$parametros['idcc']}";
        }
        $addWhere1 = "where true";
        if ($parametros['idff']) {
            $addWhere1 .= " AND dat_embarque.iddatosff = {$parametros['idff']}";
        }
        if ($parametros ['identidad']) {
            $addWhere .= " AND dat_solicitud711.identidadcliente = {$parametros ['identidad']}" ;
        }
        if ($parametros['fechainicio'] || $parametros['fechafin']) {
            $addWhere .= " AND (substring(dat_contrato.fechacontratacion::text, 1, 10))::date between '{$parametros['fechainicio']}' and '{$parametros['fechafin']}'";
        }
        
        $sql ="SELECT 
                mod_plan711.dat_contrato.totalcontratado,
                mod_plan711.dat_contrato.fechacontratacion,
                mod_plan711.dat_plan711.idejercicio,
                mod_plan711.dat_solicitud711.idplan711,
                montoscontratados.montopagado,
                mod_plan711.dat_solicitud711.iddatosempimp,
                sum(mod_plan711.dat_contrato.totalcontratado) over() as total
              FROM
                mod_plan711.dat_contrato
                INNER JOIN mod_plan711.dat_solicitud711 ON (mod_plan711.dat_contrato.idsolicitud711 = mod_plan711.dat_solicitud711.idsolicitud711)
                INNER JOIN mod_plan711.dat_plan711 ON (mod_plan711.dat_solicitud711.idplan711 = mod_plan711.dat_plan711.idplan711)
                INNER JOIN (select r.idcontrato,
                        sum (r.montopagado) as montopagado
                      from 
                      (
                      SELECT 
                        idcontrato,
                        monto,
                        case when fechareal is not null then monto else 0 end as montopagado
                      FROM 
                        mod_plan711.dat_embarque $addWhere1)r
                        group by r.idcontrato) montoscontratados ON (mod_plan711.dat_contrato.idcontrato = montoscontratados.idcontrato) 
                where dat_plan711.idplan711={$parametros['idejercicio']} $addWhere
                group  by mod_plan711.dat_contrato.totalcontratado,
                mod_plan711.dat_contrato.fechacontratacion,
                mod_plan711.dat_plan711.idejercicio,
                mod_plan711.dat_solicitud711.idplan711,
                montoscontratados.montopagado,
                mod_plan711.dat_solicitud711.iddatosempimp";
        
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarSuministradosDelAnno($parametros){
        $parametros['embfechainicio']=''.$parametros['anno'].'-01-01';
        $parametros['embfechafin']=''.$parametros['anno'].'-12-31';
        
        $conn = Doctrine_Manager::connection();
        $addWhere = "true ";
        if ($parametros['idempimp']) {
            $addWhere .= " AND dat_solicitud711.iddatosempimp = {$parametros['idempimp']}";
        }
        if ($parametros['idcc']) {
            $addWhere .= " AND dat_solicitud711.iddatoscc = {$parametros['idcc']}";
        }
        $addWhere1 = "where true";
        if ($parametros['idff']) {
            $addWhere1 .= " AND dat_embarque.iddatosff = {$parametros['idff']}";
        }
        if ($parametros['embfechainicio'] || $parametros['embfechafin']) {
            $addWhere1 .= " AND fechareal between '{$parametros['embfechainicio']}' and '{$parametros['embfechafin']}'";
        }
        if ($parametros ['identidad']) {
            $addWhere .= " AND dat_solicitud711.identidadcliente = {$parametros ['identidad']}" ;
        }
        if ($parametros['fechainicio'] || $parametros['fechafin']) {
            $addWhere .= " AND (substring(montoscontratados.fechareal::text, 1, 10))::date between '{$parametros['fechainicio']}' and '{$parametros['fechafin']}'";
        }
        
        $addWhere2 = "";
        if ($parametros['tipoplan']) {
            $addWhere2 .= " AND dat_plan711.idtipoplan =  {$parametros['tipoplan']}";
        }
        
        $sql ="SELECT 
                mod_plan711.dat_contrato.totalcontratado,
                mod_plan711.dat_contrato.fechacontratacion,
                mod_plan711.dat_plan711.idejercicio,
                mod_plan711.dat_solicitud711.idplan711,
                montoscontratados.montopagado,
                mod_plan711.dat_solicitud711.iddatosempimp,
                sum(montoscontratados.montopagado) over() as total
              FROM
                mod_plan711.dat_contrato
                INNER JOIN mod_plan711.dat_solicitud711 ON (mod_plan711.dat_contrato.idsolicitud711 = mod_plan711.dat_solicitud711.idsolicitud711)
                INNER JOIN mod_plan711.dat_plan711 ON (mod_plan711.dat_solicitud711.idplan711 = mod_plan711.dat_plan711.idplan711 $addWhere2)
                INNER JOIN (select r.idcontrato,
                        sum (r.monto) as montopagado, r.fechareal
                      from 
                      (
                      SELECT 
                        idcontrato,
                        monto, fechareal
                      FROM 
                        mod_plan711.dat_embarque $addWhere1)r
                        group by r.idcontrato, r.fechareal) montoscontratados ON (mod_plan711.dat_contrato.idcontrato = montoscontratados.idcontrato) 
                where $addWhere
                group  by mod_plan711.dat_contrato.totalcontratado,
                mod_plan711.dat_contrato.fechacontratacion,
                mod_plan711.dat_plan711.idejercicio,
                mod_plan711.dat_solicitud711.idplan711,
                montoscontratados.montopagado,
                mod_plan711.dat_solicitud711.iddatosempimp";
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarPendientesSumDelAnno($parametros){
        $parametros['embfechainicio']=''.$parametros['anno'].'-01-01';
        $parametros['embfechafin']=''.$parametros['anno'].'-12-31';
        
        $conn = Doctrine_Manager::connection();
        $addWhere = "true ";
        if ($parametros['idempimp']) {
            $addWhere .= " AND dat_solicitud711.iddatosempimp = {$parametros['idempimp']}";
        }
        if ($parametros['idcc']) {
            $addWhere .= " AND dat_solicitud711.iddatoscc = {$parametros['idcc']}";
        }
        $addWhere1 = "where true";
        if ($parametros['idff']) {
            $addWhere1 .= " AND dat_embarque.iddatosff = {$parametros['idff']}";
        }
        if ($parametros['embfechainicio'] || $parametros['embfechafin']) {
            $addWhere1 .= " AND fechaposible between '{$parametros['embfechainicio']}' and '{$parametros['embfechafin']}' and fechareal is null";
        }
        if ($parametros ['identidad']) {
            $addWhere .= " AND dat_solicitud711.identidadcliente = {$parametros ['identidad']}" ;
        }
        if ($parametros['fechainicio'] || $parametros['fechafin']) {
            $addWhere .= " AND (substring(dat_contrato.fechacontratacion::text, 1, 10))::date between '{$parametros['fechainicio']}' and '{$parametros['fechafin']}'";
        }
        
        $addWhere2 = "";
        if ($parametros['tipoplan']) {
            $addWhere2 .= " AND dat_plan711.idtipoplan =  {$parametros['tipoplan']}";
        }
        
        $sql ="SELECT 
                mod_plan711.dat_contrato.totalcontratado,
                mod_plan711.dat_contrato.fechacontratacion,
                mod_plan711.dat_plan711.idejercicio,
                mod_plan711.dat_solicitud711.idplan711,
                montoscontratados.montopagado,
                mod_plan711.dat_solicitud711.iddatosempimp,
                sum(mod_plan711.dat_contrato.totalcontratado) over() as total
              FROM
                mod_plan711.dat_contrato
                INNER JOIN mod_plan711.dat_solicitud711 ON (mod_plan711.dat_contrato.idsolicitud711 = mod_plan711.dat_solicitud711.idsolicitud711)
                INNER JOIN mod_plan711.dat_plan711 ON (mod_plan711.dat_solicitud711.idplan711 = mod_plan711.dat_plan711.idplan711 $addWhere2)
                INNER JOIN (select r.idcontrato,
                        sum (r.monto) as montopagado
                      from 
                      (
                      SELECT 
                        idcontrato,
                        monto
                      FROM 
                        mod_plan711.dat_embarque $addWhere1)r
                        group by r.idcontrato) montoscontratados ON (mod_plan711.dat_contrato.idcontrato = montoscontratados.idcontrato) 
                where $addWhere
                group  by mod_plan711.dat_contrato.totalcontratado,
                mod_plan711.dat_contrato.fechacontratacion,
                mod_plan711.dat_plan711.idejercicio,
                mod_plan711.dat_solicitud711.idplan711,
                montoscontratados.montopagado,
                mod_plan711.dat_solicitud711.iddatosempimp";
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarAccionesEmbarquesCt($parametros){
        $conn = Doctrine_Manager::connection();
        $addWhere = "and true";
        $sql ="SELECT idembarque, idcontrato, iddatosff, monto, fechaposible, fechareal, 
                    codigofactura, iddatosaccion, 
                    ff.denominacion as fuentes,
                    acc.denominacion as accion,
                    condc.descripcion,
                    condc.denominacion as uricondicion
                    FROM
                      mod_plan711.dat_embarque
                      left JOIN mod_planificacion.nom_datosnomenclador acc ON (mod_plan711.dat_embarque.iddatosaccion = acc.iddatosnomenclador)
                      left JOIN mod_planificacion.nom_datosnomenclador ff ON (mod_plan711.dat_embarque.iddatosff = ff.iddatosnomenclador)
		      left JOIN mod_planificacion.nom_datosnomenclador condc ON (condc.denominacion = acc.descripcion )
                      where idcontrato={$parametros['idcontrato']}";
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarCtEmbFormaPago($parametros){
        $conn = Doctrine_Manager::connection();
        $addWhere = "and true";
        $sql ="SELECT idembarqueformapago, idembarque, iddatosformapago, fechaposible, 
                    fechareal, porciento, monto,
                    acc.denominacion as formapago
                    FROM
                      mod_plan711.dat_embarqueformapago
                      left JOIN mod_planificacion.nom_datosnomenclador acc ON (mod_plan711.dat_embarqueformapago.iddatosformapago = acc.iddatosnomenclador)
                       where idembarque={$parametros['idembarque']}";
        
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarCtEmbFormaPagoTodo($parametros){
        $conn = Doctrine_Manager::connection();
        $addWhere = "and true";
        $sql ="SELECT idembarqueformapago, eb.idembarque, iddatosformapago, dat_embarqueformapago.fechaposible, 
                    dat_embarqueformapago.fechareal, porciento, dat_embarqueformapago.monto,
                    acc.denominacion as formapago
                    FROM
                      mod_plan711.dat_embarqueformapago
                      left JOIN mod_planificacion.nom_datosnomenclador acc ON (mod_plan711.dat_embarqueformapago.iddatosformapago = acc.iddatosnomenclador)
                    left JOIN mod_plan711.dat_embarque eb ON (dat_embarqueformapago.idembarque = eb.idembarque)
                    left JOIN mod_plan711.dat_contrato ct ON (eb.idcontrato = ct.idcontrato)
                    where ct.idcontrato ={$parametros['idcontrato']}";
        
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarDetallesEmbarq($parametros){
        $conn = Doctrine_Manager::connection();
        $addWhere = "and true";
        $sql ="SELECT idembarquecubicaje, idembarque, iddatoscubicaje, cantidad,
                    acc.denominacion as cubicaje
                    FROM mod_plan711.dat_embarquecubicaje 
                    left JOIN mod_planificacion.nom_datosnomenclador acc ON (mod_plan711.dat_embarquecubicaje.iddatoscubicaje = acc.iddatosnomenclador)
                    where idembarque={$parametros['idembarque']}";
        
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarDetallesEmbarqTodo($parametros){
        $conn = Doctrine_Manager::connection();
        $addWhere = "and true";
        $sql ="SELECT idembarquecubicaje, eb.idembarque, iddatoscubicaje, cantidad,
                    acc.denominacion as cubicaje
                    FROM mod_plan711.dat_embarquecubicaje 
                    left JOIN mod_planificacion.nom_datosnomenclador acc ON (mod_plan711.dat_embarquecubicaje.iddatoscubicaje = acc.iddatosnomenclador)
                    left JOIN mod_plan711.dat_embarque eb ON (dat_embarquecubicaje.idembarque = eb.idembarque)
                    left JOIN mod_plan711.dat_contrato ct ON (eb.idcontrato = ct.idcontrato)
                    where ct.idcontrato ={$parametros['idcontrato']}";
        
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function ActualizarFechaAcciones($parametros){
        $conn = Doctrine_Manager::connection();
        //print_r($parametros['listafechareal']); die;
        foreach ($parametros['listafechareal'] as $value) {
            $saldida=null;
            if ($value[1]!=''){
                //print_r('dsfsd'); die;
                $fech= str_replace('T', ' ', $value[1]);
                $a = date_create_from_format('Y-m-d h:i:s',$fech);
                $saldida = date_format($a,"Y-m-d h:i:s");
            }
            //print_r($saldida.'jhkjh'); die;
            $sqlinsert = "UPDATE mod_plan711.dat_embarque
                        SET fechareal= '$saldida'
                      WHERE idembarque= {$value[0]}";
            $conn->execute($sqlinsert);
        }
        return 1;
    }
    
    public function ActualizarFechaFormaPago($parametros){
        $conn = Doctrine_Manager::connection();
        foreach ($parametros['listafechareal'] as $value) {
            $saldida=null;
            if ($value[1]!=''){
                $fech= str_replace('T', ' ', $value[1]);
                $a = date_create_from_format('Y-m-d h:i:s',$fech);
                $saldida = date_format($a,"Y-m-d h:i:s");
            }
            $sqlinsert = "UPDATE mod_plan711.dat_embarqueformapago
                            SET fechareal= '$saldida'
                          WHERE idembarqueformapago= {$value[0]}";
            $conn->execute($sqlinsert);
        }
        return 1;
    }
    
    public function EliminarCT($parametros) {
        $conn = Doctrine_Manager::connection();
        $sqlinsert = "DELETE FROM mod_plan711.dat_solicitudfuentesf
                        WHERE idsolicitud711 = {$parametros['idsolicitud711']} and idcontrato ={$parametros['idcontrato']}";
        $conn->execute($sqlinsert);
        
        $sqlinsert = "DELETE FROM mod_plan711.dat_contrato
                        WHERE idcontrato ={$parametros['idcontrato']}";
        $conn->execute($sqlinsert);
        
        $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                SET 
                   iddatosffsol= (Select iddatosffsol_old from mod_plan711.dat_solicitud711 WHERE idsolicitud711 = {$parametros['idsolicitud711']})
              WHERE idsolicitud711 = {$parametros['idsolicitud711']}";
        $conn->execute($sqlinsert);
        return 1;
    }
      
}