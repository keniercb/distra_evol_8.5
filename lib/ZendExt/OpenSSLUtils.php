<?php

/**
 * Created by PhpStorm.
 * User: aleks
 * Date: 14/09/16
 * Time: 9:11
 */
class ZendExt_OpenSSLUtils
{
    private $CAcert;
    private $workingDir;

    public function __construct ()
    {
        $data = parse_ini_file(DIR_ABS_MT . 'config/certs/server/certificate.ini');
        $this->workingDir = DIR_ABS_MT . 'session/';
        $this->CAcert = file_get_contents($data['cert_location'] . $data['CAcertificate']);
    }

    public function OCSPRequest ($certificate) {
        $a = rand(1000,99999);
        $cert_client = $this->GenerateTemp($a, $certificate, "cert_client.crt");
        $cert_issuer = $this->GenerateTemp($a, $this->CAcert, "cert_issuer.crt");
        $infoca = shell_exec(
            'openssl x509 -in '.$cert_client.' -noout -text | grep OCSP'
        );
        $OCSPUrl = $this->TextExtract($infoca, 'OCSP - URI:');
        $output = shell_exec(
            'openssl ocsp -CAfile '.$cert_issuer.' -issuer '.$cert_issuer.' -cert '.$cert_client.' -url '.$OCSPUrl
        );
        $this->UnlinkTemp(array($cert_client, $cert_issuer));
        $ocsp = $this->TextExtract($output, ': ');
        return $ocsp;
    }

    public function SkiFromX509 ($file) {
        $a = rand(1000,99999);
        $tempCert = $this->GenerateTemp($a, $file, "x509temp.crt");
        $infoski = shell_exec(
            'openssl x509 -in '.$tempCert.' -noout -text | grep -A1 "Subject Key Identifier"'
        );
        $ski = $this->TextExtract($infoski, 'Identifier:');
        $ski = preg_replace('/:+/', '', $ski);
        $this->UnlinkTemp($tempCert);
        return $ski;
    }

    public function SubjectFromX509 ($file) {
        $a = rand(1000,99999);
        $tempCert = $this->GenerateTemp($a, $file, "x509temp.crt");
        $infosubject = shell_exec(
            'openssl x509 -in '.$tempCert.' -noout -text'
        );
        $username = $this->TextExtract($infosubject, 'Subject: CN=');
        $this->UnlinkTemp($tempCert);
        return $username;
    }

    private function TextExtract ($text, $regex) {
        $index = 0;
        $formatedText = preg_split('/'.$regex.'/', $text);
        $newtext = preg_split('/[\r\n]/',$formatedText[1]);
        while($newtext[$index] == " ")
            $index++;
        $finaldata = preg_replace('/\s+/', '', $newtext[$index]);
        return $finaldata;
    }

    private function GenerateTemp ($no, $certificate, $name) {
        file_put_contents($this->workingDir.$no.$name, $certificate);
        return (string)$this->workingDir.$no.$name;
    }

    private function UnlinkTemp ($file) {
        if(is_array($file))
            foreach($file as $f)
                unlink($f);
        else
            unlink($file);
    }
}