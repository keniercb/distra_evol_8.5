<?php

class DatAvisoDestinatarioViaContenido
    extends BaseDatAvisoDestinatarioViaContenido
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatDestinatario',
            array('local' => 'iddestinatario', 'foreign' => 'iddestinatario')
        );
        $this->hasOne(
            'DatContenido',
            array('local' => 'idcontenido', 'foreign' => 'idcontenido')
        );
        $this->hasOne(
            'DatAviso', array('local' => 'idaviso', 'foreign' => 'idaviso')
        );
    }

    private static function formatContents($contents)
    {
        $result = array();
        $contentTypes = NomTipocontenido:: cargarTipoContenidos();
        foreach ($contentTypes as $contentType) {
            foreach ($contents as $content) {
                foreach ($content as $key => $value) {
                    if (end(explode('_', $key)) == $contentType['denominacion']
                        && $value !== null
                    ) {
                        $result[$contentType['denominacion']]['viaenvio']
                            = $contentType['viaenvio'];
                        if (strstr($key, 'asunto')) {
                            $result[$contentType['denominacion']]['asunto']
                                = $value;
                        }
                        $result[$contentType['denominacion']]['mensaje']
                            = $value;
                    }
                }
            }
        }

        return $result;
    }

    public static function getContentsByAviso($idaviso, $formatContents = true)
    {
      $query
      = 'SELECT d.idaviso as idaviso, d.idcontenido, d3.asunto as asunto_email,
          d3.texto as texto_email, d4.texto as texto_jabber,
          d5.texto as texto_sistema, d6.texto as texto_smstext
          FROM dat_avisodestinatarioviacontenido d
          INNER JOIN dat_contenido d2 ON d.idcontenido = d2.idcontenido
          LEFT JOIN dat_emailcontent d3 ON d2.idcontenido = d3.idcontenido
          LEFT JOIN dat_jabbercontent d4 ON d2.idcontenido = d4.idcontenido
          LEFT JOIN dat_sistemacontent d5 ON d2.idcontenido = d5.idcontenido
          LEFT JOIN dat_smstextcontent d6 ON d2.idcontenido = d6.idcontenido
          WHERE (d.idaviso = ' . $idaviso . ')
          GROUP BY d.idaviso, d.idcontenido,d3.asunto, d3.texto,d4.texto,
           d5.texto,d6.texto';
        $result = Doctrine_Manager:: getInstance()->getCurrentConnection()
            ->fetchAll($query);
        if ($formatContents) {
            return self:: formatContents($result);
        }

        return $result;
    }

    public static function getDistinctContents($idaviso)
    {
        return Doctrine_Query:: create()
            ->select('idcontenido as idcontenido')
            ->distinct()
            ->from(__CLASS__)
            ->where('idaviso = ?', $idaviso)
            ->execute()
            ->toArray();
    }

    public static function deleteByDestAndAviso($aviso, $dests)
    {
        Doctrine_Query::create()
            ->delete()
            ->from(__CLASS__)
            ->whereIn('iddestinatario', $dests)
            ->andWhere('idaviso = ?', $aviso)
            ->execute();
    }

    public static function existee($idaviso, $idcontenido, $iddestinatario)
    {
        $query = Doctrine_Query::create();
        return is_numeric(
            $query->select('idaviso')->from(__CLASS__)->where('idaviso = ?', $idaviso)->andWhere(
                'idcontenido = ?', $idcontenido
            )->andWhere('iddestinatario = ?', $iddestinatario)->setHydrationMode(Doctrine::HYDRATE_SINGLE_SCALAR)
            ->execute()
        );
    }

    /**
     * obtenerConfiguracionAviso
     * Devuelve la configuracion de avisos
     *
     * @param array $avisoConfig Listado de identificadores de avisos
     *
     * @returns array
     * @author Yordenis
     */
    public static function obtenerConfiguracionAvisos($avisoConfig)
    {
        $resultado1 = array();
        $inStr = implode(',', $avisoConfig);
        $resultado1['jabber'] = Doctrine_Manager:: getInstance()
            ->getCurrentConnection()
            ->fetchAll(
                "SELECT d3.texto AS texto, d6.idpersona AS idpersona,
                        d4.idaviso AS idaviso
                 FROM dat_avisodestinatarioviacontenido d
                 INNER JOIN dat_contenido d2 ON d.idcontenido = d2.idcontenido
                 INNER JOIN dat_jabbercontent d3
                 ON d2.idcontenido = d3.idcontenido
                 INNER JOIN dat_aviso d4 ON d.idaviso = d4.idaviso
                 INNER JOIN dat_destinatario d5
                 ON d.iddestinatario = d5.iddestinatario
                 INNER JOIN dat_personanotificacion d6
                 ON d5.iddestinatario = d6.iddestinatario
                 WHERE (d4.idaviso IN (${inStr}))"
            );

        $resultado1['correo'] = Doctrine_Manager:: getInstance()
            ->getCurrentConnection()
            ->fetchAll(
                "SELECT d3.texto AS texto, d3.asunto AS asunto,
                  d6.idpersona AS idpersona,d4.idaviso AS idaviso
              FROM dat_avisodestinatarioviacontenido d
              INNER JOIN dat_contenido d2 ON d.idcontenido = d2.idcontenido
              INNER JOIN dat_emailcontent d3 ON d2.idcontenido = d3.idcontenido
              INNER JOIN dat_aviso d4 ON d.idaviso = d4.idaviso
              INNER JOIN dat_destinatario d5
              ON d.iddestinatario = d5.iddestinatario
              INNER JOIN dat_personanotificacion d6
              ON d5.iddestinatario = d6.iddestinatario
              WHERE (d4.idaviso IN (${inStr}))"
            );

        $resultado1['sms'] = Doctrine_Manager:: getInstance()
            ->getCurrentConnection()
            ->fetchAll(
                "SELECT d3.texto AS texto, d6.idpersona AS idpersona,
d4.idaviso AS idaviso
                        FROM dat_avisodestinatarioviacontenido d
                        INNER JOIN dat_contenido d2
                        ON d.idcontenido = d2.idcontenido
                        INNER JOIN dat_smstextcontent d3
                        ON d2.idcontenido = d3.idcontenido
                        INNER JOIN dat_aviso d4 ON d.idaviso = d4.idaviso
                        INNER JOIN dat_destinatario d5
                        ON d.iddestinatario = d5.iddestinatario
                        INNER JOIN dat_personanotificacion d6
                        ON d5.iddestinatario = d6.iddestinatario
                        WHERE (d4.idaviso IN (${inStr}))"
            );

        return $resultado1;
    }

}
