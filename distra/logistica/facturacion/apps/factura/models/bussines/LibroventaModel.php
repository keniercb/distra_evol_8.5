<?php

class LibroventaModel extends ZendExt_Model
{

    public function __construct($datos = array())
    {
        parent::__construct();
        $this->facturaDoc = new DatDocfactura();
        $this->transacc = array('01' => '01 - reg', '02' => '02 - com', '03' => '03 - anu', '04' => '04 - aju');
    }

    public function cargarDocumentos($uiParams)
    {
        $this->buildFilters($uiParams);
        return $this->cargarDocumentosLibroVentas($uiParams);
    }

    public function buildFilters(&$uiParams)
    {
        $arrfiltro[] = ' n.anulado = 1 or n.asignado = 1 ';
        if ($uiParams['idestructuracomun']) {
            $arrfiltro[] = " d.idestructuracomun in({$uiParams['idestructuracomun']}) ";
        }
        if ($uiParams['to'] && !$uiParams['from']) {
            $arrfiltro[] = " d.fechacontable <= ? OR n.fechaanulado <= ? ";
            $arrValues[] = $uiParams['to'];
            $arrValues[] = $uiParams['to'];
        } else {
            if (!$uiParams['to'] && $uiParams['from']) {
                $arrfiltro[] = " d.fechacontable >= ? OR n.fechaanulado >= ? ";
                $arrValues[] = $uiParams['from'];
                $arrValues[] = $uiParams['from'];
            } else {
                if ($uiParams['to'] && $uiParams['from']) {
                    $arrfiltro[] = " (d.fechacontable between ? AND ? ) OR (n.fechaanulado between ? AND ? )";
                    $arrValues[] = $uiParams['to'];
                    $arrValues[] = $uiParams['from'];
                    $arrValues[] = $uiParams['to'];
                }
            }
        }
        return $uiParams['filter'] = array('filtro' => implode(' AND ', $arrfiltro), 'valores' => $arrValues);
    }

    public function cargarDocumentosLibroVentas($uiParams)
    {
        //        $query = new Doctrine_Query();
        //        $query->select("d.fechacontable,f.idcliente,n.nrodocumento as nrofactura,
        //        n.nrocontrol as nrocontrol,dp.iddocumento")
        //                ->from("DatNumerocontrol n")
        //                ->leftJoin("n.DatDocFactura f")
        //                ->leftJoin("f.DatDocumento d")
        //                ->leftJoin("d.DatDocumentoPadre dp on dp.idpadre = d.iddocumento")
        //                ->leftJoin("d.DatMovimiento m")
        //                ->leftJoin("m.DatMovimientoVenta mv")
        //                ->leftJoin("m.DatProdFactura p")
        //                ->leftJoin("f.DatServFactura s")
        //                ->where("n.anulado = 1 or n.asignado = 1")
        //                ->orderBy("n.nrocontrol asc");
        //       return array('total' => $query->count(), 'datos' => $query->limit($uiParams['limit'])->offset($uiParams['start'])->fetchArray());
        $query = "select
        '111' as iddocumento , 
        '1/1/1' as fecha, 
        '23' as plantilla, 
        '223' as nofactura,
        '34' as nocontrol,
        '33' as notadebito,
        '1' as notacredito,
        'Estado' as estatus,
        '3213' as facturaafectada,
        '23' as ventaiva,
        '32' as ventainter,
        '323' as baseimponible,
        '45%' as alicuota,
        '23.5' as impuestoiva,
        '15.5' as ivacomprador,
        '20.5' as ivapercivido
         from mod_logfacturacion.dat_docfactura";
        $conn = Zend_Registry:: get('conexion');
        $datos = $conn->execute($query)
            ->fetchAll(PDO::FETCH_ASSOC);
        return array('total' => count($datos), 'datos' => $datos);
    }

    //    public function cargarDocumentosLibroVentas($uiParams)
    //    {
    //        $uiParams['idestructuracomun'] = ($uiParams['idestructuracomun']) ?
    //                $uiParams['idestructuracomun'] : $this->global->Estructura->idestructura;
    //        $arrfiltro = $this->buildFilters($uiParams);
    //        if ($uiParams['limit']) {
    //            $limitoffset = " limit {$uiParams['limit']} offset ";
    //            $limitoffset.= ($uiParams['start']) ? $uiParams['start'] : 0;
    //        }
    //        $conn = Zend_Registry:: get('conexion');
    //        $selectDatos = "select distinct d.iddocumento,
    //                (case when n.anulado = 1 then n.fechaanulado else d.fechacontable end ) as fechacontable ,
    //                d.estado::text,d.nrodoc::text,d.idestructuracomun, es.denominacion as estructura,
    //                (case when ndp.abreviatura = 'SCM110' then coalesce(es.abreviatura,'') || ' ' ||
    //                nsd.denominacion ||'-'||n.nrodocumento::varchar else NULL END ) as nrofactura,
    //                (case when ndp.abreviatura = 'notacredito' then coalesce(es.abreviatura,'') || ' ' ||
    //                nsd.denominacion || '-'||n.nrodocumento::varchar else NULL END ) as notacredito,
    //                (case when ndp.abreviatura = 'notadebito' then coalesce(es.abreviatura,'') || ' ' ||
    //                nsd.denominacion || '-'||n.nrodocumento::varchar else NULL END ) as notadebito, n.nrocontrol as nrocontrol,
    //                (case when (ndp.abreviatura = 'notadebito' or ndp.abreviatura = 'notacredito')
    //                then (select coalesce(es.abreviatura,'') || ' ' || nsd1.denominacion || '-'||
    //                nc.nrodocumento from mod_logfacturacion.dat_numerocontrol as nc
    //                inner join mod_logfacturacion.dat_docfactura ff on ff.idnumerocontrol = nc.idnumerocontrol
    //                left join mod_logfacturacion.dat_seriedocentidad dse1 on dse1.idseriedocentidad = nc.idseriedocentidad
    //                left join mod_logfacturacion.nom_seriedocumento nsd1 on dse1.idseriedocumento = nsd1.idseriedocumento
    //                 where ff.idfactura = dp.idpadre)else NULL END) as nrofactafectada,
    //                (case when rc.idtipoente=1 then ( pers.nombre || ' ' || COALESCE(pers.snombre,'') || ' ' || pers.papel
    //                 || ' '|| pers.sapel ) when rc.idtipoente=2 then e.denominacion
    //                 when n.anulado = 1 then 'ANULADO' end ) as cliente,
    //                (case when rc.idtipoente=1 then pers.numid when rc.idtipoente=2 then e.codigo end ) as rif,
    //                (case when n.anulado = 1 then '3-reg' else '1-reg' end) as transaccion,
    //                (case when ndp.abreviatura = 'notacredito' then replace((round(sum(coalesce(m.importecontable , 0.00)
    //                 + coalesce(s.tarifacontable,0.00)),2)*-1)::varchar,'.',',') else
    //                  replace(round(sum(coalesce(m.importecontable , 0.00) +
    //                  coalesce(s.tarifacontable,0.00)),2)::varchar,'.',',') END)as totalventaciva,
    //                (case when ndp.abreviatura = 'notacredito' then
    //                replace((sum(coalesce(m.importecontable , 0.00) +
    //                coalesce(s.tarifacontable,0.00))*-1)::varchar,'.',',') else
    //                replace(round(sum(coalesce(m.importecontable , 0.00) +
    //                coalesce(s.tarifacontable,0.00)),2)::varchar,'.',',') END )as totalventacivaoriginal,
    //                coalesce ((select (case when ndp1.abreviatura = 'notacredito'
    //                then replace(round((sum(coalesce(m1.importecontable , 0.00) +
    //                coalesce(s1.tarifacontable,0.00))*-1),2)::varchar,'.',',') else
    //                replace(round(sum(coalesce(m1.importecontable , 0.00) +
    //                coalesce(s1.tarifacontable,0.00)),2)::varchar,'.',',') END) as totalventasnograb
    //                from mod_logistica.dat_documento dd
    //                inner join mod_datosmaestros.dat_documentoprim ddp1 on dd.iddoc = ddp1.iddoc
    //                inner join mod_datosmaestros.nom_docprim ndp1 on ndp1.iddocumentos = ddp1.iddocumentos
    //                left join mod_logistica.dat_movimiento m1 on m1.iddocumento = dd.iddocumento
    //                left join mod_logfacturacion.dat_movimientoventa mv1 on m1.idmovimiento = mv1.idmovimiento
    //                left join mod_logfacturacion.dat_servfactura s1 on s1.idfactura = dd.iddocumento
    //                left join mod_logfacturacion.dat_servicioventa sv1 on s1.idservfactura = sv1.idservfactura
    //                where dd.iddocumento = d.iddocumento and (coalesce(sv1.valor,0) = 0 AND coalesce(mv1.valor,0) = 0)
    //                group by ndp1.abreviatura ,d.iddocumento
    //                ),'0,00')as totalventasnograb,(
    //                select ARRAY_AGG ('{ ''alicuota''' ||':'|| '''' ||t.alicuota || ''',''baseimponible'':'''||
    //                t.baseimponible||''',''importe'':'''|| t.totalv ||'''}' ) from
    //                ( select (case when mv1.valor is not null AND mv1.valor::int > 0 then
    //                replace(coalesce(round(mv1.valor,2),0.00)::varchar,'.',',') || ' %'
    //                when sv1.valor is not null AND sv1.valor::int > 0 then
    //                replace(coalesce(round(sv1.valor,2),0.00)::varchar,'.',',') || ' %'
    //                else '0,00 %'
    //                END) as alicuota
    //                , (case when ndp1.abreviatura = 'notacredito' then
    //                replace((round(sum(coalesce(p1.preciobase , 0.00)
    //                + coalesce(s1.tarifabase,0.00)),2)*-1)::varchar,'.',',')
    //                else replace(round(sum(coalesce(p1.preciobase , 0.00)
    //                + coalesce(s1.tarifabase,0.00)),2)::varchar,'.',',')
    //                END
    //                ) as baseimponible,(
    //                case when ndp1.abreviatura = 'notacredito' then replace((round(sum(coalesce(m1.importecontable , 0.00
    //                + coalesce(s1.tarifacontable,0.00)),2)*-1)::varchar,'.',',')
    //                else replace(round(sum(coalesce(m1.importecontable , 0.00)
    //                + coalesce(s1.tarifacontable,0.00)),2)::varchar,'.',',') END
    //                ) as totalv
    //                from mod_logistica.dat_documento dd
    //                inner join mod_datosmaestros.dat_documentoprim ddp1 on dd.iddoc = ddp1.iddoc
    //                inner join mod_datosmaestros.nom_docprim ndp1 on ndp1.iddocumentos = ddp1.iddocumentos
    //                left join mod_logistica.dat_movimiento m1 on m1.iddocumento = dd.iddocumento
    //                left join mod_logfacturacion.dat_movimientoventa mv1 on m1.idmovimiento = mv1.idmovimiento
    //                left join mod_logfacturacion.dat_prodfactura p1 on p1.idmovimiento = m1.idmovimiento
    //                left join mod_logfacturacion.dat_servfactura s1 on s1.idfactura = dd.iddocumento
    //                left join mod_logfacturacion.dat_servicioventa sv1 on s1.idservfactura = sv1.idservfactura
    //                where dd.iddocumento = d.iddocumento
    //                group by alicuota ,ndp1.abreviatura
    //                ) t
    //                ) as datosimportes ,(
    //                    SELECT case when (ddoblig.idperiodo = dcprt.idperiodo)
    //                    then replace(round(coalesce(dcprt.totalretencion,0.00),2)::varchar,'.',',')
    //                    else '0,00' end
    //                    FROM mod_finanzas.dat_compretenciones dcprt
    //                    inner join mod_cobroypago.dat_origen dorig
    //                    on dcprt.idderechouobligacion = dorig.idderechouobligacion AND dorig.iddocumento = d.iddocumento
    //                    inner join mod_cobroypago.dat_derechouobligacion ddoblig
    //                    on ddoblig.idderechouobligacion = dorig.idderechouobligacion
    //                ) as ivaretenido ";
    //        $selectCount = " SELECT count (distinct n.nrocontrol ) as cant";
    //
    //        $fromjoin = " from mod_logfacturacion.dat_numerocontrol n
    //  	                left join mod_logfacturacion.dat_docfactura f on f.idnumerocontrol = n.idnumerocontrol
    //  	                left join mod_logfacturacion.dat_seriedocentidad dse
    //  	                on dse.idseriedocentidad = n.idseriedocentidad
    //  	                left join mod_logfacturacion.nom_seriedocumento nsd
    //  	                on dse.idseriedocumento = nsd.idseriedocumento
    //  	                left join mod_logistica.dat_documento d on d.iddocumento = f.idfactura
    //  	                left join mod_datosmaestros.dat_documentoprim ddp on d.iddoc = ddp.iddoc
    //  	                left join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    //  	                left join mod_logistica.dat_documentopadre dp on dp.iddocumento = d.iddocumento
    //  	                left join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
    //  	                left join mod_logfacturacion.dat_movimientoventa mv on m.idmovimiento = mv.idmovimiento
    //  	                left join mod_logfacturacion.dat_prodfactura p on p.idmovimiento = m.idmovimiento
    //  	                left join mod_logfacturacion.dat_servfactura s on s.idfactura = f.idfactura
    //  	                left join mod_logfacturacion.dat_servicioventa sv on s.idservfactura = sv.idservfactura
    //  	                left join mod_contratacion.dat_contrato contrato on contrato.idcontrato = f.idcontrato
    //  	                left join mod_crm.dat_rolcrm rc on f.idcliente = rc.idrolcrm
    //  	                left join mod_crm.dat_rolcrmpersona rp on rp.idrolcrm = rc.idrolcrm
    //  	                left join mod_crm.dat_rolcrmestructura re on re.idrolcrm = rc.idrolcrm
    //  	                LEFT JOIN mod_estructuracomp.dat_estructura e ON e.idestructura = re.idfilaestructura
    //  	                LEFT JOIN mod_estructuracomp.dat_estructura es ON es.idestructura = d.idestructuracomun
    //  	                LEFT JOIN mod_persona.dat_persona pers on rp.idpersona = pers.idpersona
    //  	                where {$arrfiltro['filter']['filtro']} ";
    //        $selectCountRetenido = " UNION SELECT count (distinct n.nrodocumento ) as cant";
    //
    //        $selectRetenido = " UNION SELECT distinct f.idfactura, dcprt.fecharetencion,null,null,
    //        ddoblig.idestructuracomun ,null,
    //  	                            null as nrofactura,null as notacredito,null as notadebito,
    //  	                            null as nrocontrol, (select coalesce(es.abreviatura,'')
    //  	                            || ' ' || nsd.denominacion || '-'|| n.nrodocumento ) as nrofactafectada,
    //  	                            (case when rc.idtipoente=1 then ( pers.nombre || ' '
    //  	                            || COALESCE(pers.snombre,'') || ' ' || pers.papel || ' '|| pers.sapel )
    //  	                            when rc.idtipoente=2 then e.denominacion
    //  	                            when n.anulado = 1 then 'ANULADO'
    //  	                            end ) as cliente,
    //  	                            (case when rc.idtipoente=1 then pers.numid
    //  	                            when rc.idtipoente=2 then e.codigo
    //  	                            end ) as rif,'2-reg' transaccion,'0,00' as totalventaciva,
    //  	                            '0,00' as totalventacivaoriginal,'0,00' as totalventasnograb,(
    //  	                            select ARRAY_AGG ('{ ''alicuota''' ||':'|| '''' || t.alicuota || '''}' ) from (
    //  	                            select (case when mv1.valor is not null AND mv1.valor::int > 0
    //  	                            then replace(coalesce(round(mv1.valor,2),0.00)::varchar,'.',',') || ' %'
    //  	                            when sv1.valor is not null AND sv1.valor::int > 0
    //  	                            then replace(coalesce(round(sv1.valor,2),0.00)::varchar,'.',',') || ' %'
    //  	                            else '0,00 %'
    //  	                            END) as alicuota
    //  	                            from mod_logistica.dat_documento dd
    //  	                            inner join mod_datosmaestros.dat_documentoprim ddp1 on dd.iddoc = ddp1.iddoc
    //  	                            inner join mod_datosmaestros.nom_docprim ndp1
    //  	                             on ndp1.iddocumentos = ddp1.iddocumentos
    //  	                            left join mod_logistica.dat_movimiento m1 on m1.iddocumento = dd.iddocumento
    //  	                            left join mod_logfacturacion.dat_movimientoventa mv1
    //  	                            on m1.idmovimiento = mv1.idmovimiento
    //  	                            left join mod_logfacturacion.dat_prodfactura p1
    //  	                             on p1.idmovimiento = m1.idmovimiento
    //  	                            left join mod_logfacturacion.dat_servfactura s1
    //  	                            on s1.idfactura = dd.iddocumento
    //  	                            left join mod_logfacturacion.dat_servicioventa sv1
    //  	                             on s1.idservfactura = sv1.idservfactura
    //  	                            where dd.iddocumento = d.iddocumento
    //  	                            ) t
    //  	                            ) as datosimportes,
    //  	                            replace(round(coalesce(dcprt.totalretencion,0.00),2)::varchar,'.',',')
    //  	                            as ivaretenido";
    //
    //        $fromRetenido = " FROM mod_finanzas.dat_compretenciones dcprt
    //  	                        inner join mod_cobroypago.dat_origen dorig
    //  	                        on dcprt.idderechouobligacion = dorig.idderechouobligacion
    //  	                        inner join mod_cobroypago.dat_derechouobligacion ddoblig
    //  	                        on ddoblig.idderechouobligacion = dorig.idderechouobligacion
    //  	                        inner join mod_logfacturacion.dat_docfactura f on f.idfactura = dorig.iddocumento
    //  	                        inner join mod_logfacturacion.dat_numerocontrol
    //  	                        n on f.idnumerocontrol = n.idnumerocontrol
    //  	                        inner join mod_logfacturacion.dat_seriedocentidad dse
    //  	                        on dse.idseriedocentidad = n.idseriedocentidad
    //  	                        inner join mod_logfacturacion.nom_seriedocumento nsd
    //  	                        on dse.idseriedocumento = nsd.idseriedocumento
    //  	                        left join mod_logistica.dat_documento d on d.iddocumento = f.idfactura
    //  	                        left join mod_datosmaestros.dat_documentoprim ddp on d.iddoc = ddp.iddoc
    //  	                        left join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    //  	                        left join mod_logistica.dat_documentopadre dp on dp.iddocumento = d.iddocumento
    //  	                        left join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
    //  	                        left join mod_logfacturacion.dat_movimientoventa mv on m.idmovimiento = mv.idmovimiento
    //  	                        left join mod_logfacturacion.dat_prodfactura p on p.idmovimiento = m.idmovimiento
    //  	                        left join mod_logfacturacion.dat_servfactura s on s.idfactura = f.idfactura
    //  	                        left join mod_logfacturacion.dat_servicioventa sv on s.idservfactura = sv.idservfactura
    //  	                        left join mod_contratacion.dat_contrato contrato on contrato.idcontrato = f.idcontrato
    //  	                        left join mod_crm.dat_rolcrm rc on f.idcliente = rc.idrolcrm
    //  	                        left join mod_crm.dat_rolcrmpersona rp on rp.idrolcrm = rc.idrolcrm
    //  	                        left join mod_crm.dat_rolcrmestructura re on re.idrolcrm = rc.idrolcrm
    //  	                        LEFT JOIN mod_estructuracomp.dat_estructura e ON e.idestructura = re.idfilaestructura
    //  	                        LEFT JOIN mod_estructuracomp.dat_estructura es ON es.idestructura = d.idestructuracomun
    //  	                        LEFT JOIN mod_persona.dat_persona pers on rp.idpersona = pers.idpersona
    //  	                        where {$arrfiltro['filter']['filtro']} AND ddoblig.idperiodo <> dcprt.idperiodo ";
    //        $groupBy = "group by d.fechacontable,f.idcliente,ndp.abreviatura,n.nrodocumento, n.nrocontrol,d.iddocumento,
    //  	                   n.fechaanulado, d.fechacontable,d.estado,d.nrodoc,d.idestructuracomun ,
    //  	                   e.denominacion,e.codigo,
    //  	                    dp.idpadre,rc.idtipoente,pers.nombre,pers.snombre,pers.papel ,
    //  	                    pers.sapel,es.denominacion,pers.numid
    //  	                    ,n.anulado,nsd.denominacion,es.abreviatura";
    //        $ordeBY = "order by query.fechacontable, query.nrocontrol ASC ";
    //        $sql = "select query.* from ( " . $selectDatos . $fromjoin . $groupBy . $selectRetenido . $fromRetenido . ")
    //         query " . $ordeBY . $limitoffset;
    //        $datos = $conn->execute($sql, $arrfiltro['filter']['valores'])->fetchAll(PDO::FETCH_ASSOC);
    //        $sqlCount = " select sum(query.cant) as cant from ( " . $selectCount . $fromjoin . $selectCountRetenido .
    //        $fromRetenido . " ) query";
    //        $cant = $conn->execute($sqlCount, $arrfiltro['filter']['valores'])->fetchAll(PDO::FETCH_ASSOC);
    //        return array('total' => $cant[0]['cant'], 'datos' => $datos);
    //    }
}
