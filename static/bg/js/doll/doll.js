var Dolls = {
    selectedItem: 0,
    selectedType: '',
    allTypes: {
        '0001': 0,
        '0002': 0,
        '0003': 0,
        '0004': 0,
        '0005': 0,
        '0006': 0,
        '0007': 0,
        '0008': 0,
        '0009': 0,
        '0010': 0,
        '0011': 0,
        '0012': 0,
        '0013': 0,
        '0014': 0,
        '0015': 0,
        '0016': 0,
        '0017': 0,
        '0018': 0,
        '0019': 0,
        '0020': 0,
    },
    actualList: {},

    // Methods
    UpdateDollInformation: function () {

        let allmp = 0;
        let allweight = 0;

        let allstr = 0;
        let alldex = 0;
        let alliint = 0;
        let allpv = 0;
        let allhp = 0;

        var app, title, countUpdateItems = 0, item;


        let layoutInfo = $('#full-info-doll');
        let iclass = parseInt($('#doll-class').val());
        let level = $('#level').val();


        /*if (iclass == 0)
        {
          allhp = 93;
        }*/


        //layoutInfo.html('');


        for (let keyItem in this.allTypes) {
            if (this.allTypes[keyItem] !== 0) {

                countUpdateItems++;

                if (countUpdateItems === 1) {
                    layoutInfo.html('');
                }

                app = (this.allTypes[keyItem].improvement > 0) ? '+' + this.allTypes[keyItem].app : '';
                title = this.allTypes[keyItem].data.title;

                if (this.allTypes[keyItem].mp > 0) {
                    allmp = parseInt(allmp) + parseInt(this.allTypes[keyItem].mp);
                }

                if (this.allTypes[keyItem].weight > 0) {
                    allweight = parseInt(allweight) + parseInt(this.allTypes[keyItem].weight);
                }

                if (this.allTypes[keyItem].str > 0) {
                    allstr = parseInt(allstr) + parseInt(this.allTypes[keyItem].str);
                }

                if (this.allTypes[keyItem].dex > 0) {
                    alldex = parseInt(alldex) + parseInt(this.allTypes[keyItem].dex);
                }

                if (this.allTypes[keyItem].iint > 0) {
                    alliint = parseInt(alliint) + parseInt(this.allTypes[keyItem].iint);
                }

                if (this.allTypes[keyItem].pv > 0) {
                    allpv = parseInt(allpv) + parseInt(this.allTypes[keyItem].pv);
                }

                if (this.allTypes[keyItem].hp > 0) {
                    allhp = parseInt(allhp) + parseInt(this.allTypes[keyItem].hp);
                }


                item = $('<div>').addClass('item-simple').html(
                    '<div class="icon-simple" style="background-image: url(' + this.allTypes[keyItem].data.icon + ')"></div>' + title
                );

                layoutInfo.append(item);

            }
        }

        if (iclass === 0) {
            allhp = allhp + allstr * 3;
            allweight = allweight + allstr * 30;
            allmp = allmp + alliint * 2;

            switch (parseInt(level)) {
				case 1:
					allhp = allhp + 111;
					allmp = allmp + 51;
					allpv = allpv + 1;
					allstr = allstr + 15;
					alldex = alldex + 10;
					alliint = alliint + 10;
					allweight = allweight + 3475;
					break;
				case 2:
					allhp = allhp + 122;
					allmp = allmp + 52;
					allpv = allpv + 1;
					allstr = allstr + 15;
					alldex = alldex + 10;
					alliint = alliint + 10;
					allweight = allweight + 3500;
					break;
				case 3:
					allhp = allhp + 136;
					allmp = allmp + 53;
					allpv = allpv + 1;
					allstr = allstr + 16;
					alldex = alldex + 10;
					alliint = alliint + 10;
					allweight = allweight + 3555;
					break;
				case 4:
					allhp = allhp + 147;
					allmp = allmp + 54;
					allpv = allpv + 1;
					allstr = allstr + 16;
					alldex = alldex + 10;
					alliint = alliint + 10;
					allweight = allweight + 3580;
					break;
				case 5:
					allhp = allhp + 158;
					allmp = allmp + 55;
					allpv = allpv + 1;
					allstr = allstr + 16;
					alldex = alldex + 10;
					alliint = alliint + 10;
					allweight = allweight + 3605;
					break;
				case 6:
					allhp = allhp + 172;
					allmp = allmp + 56;
					allpv = allpv + 1;
					allstr = allstr + 17;
					alldex = alldex + 10;
					alliint = alliint + 10;
					allweight = allweight + 3660;
					break;
				case 7:
					allhp = allhp + 183;
					allmp = allmp + 57;
					allpv = allpv + 1;
					allstr = allstr + 17;
					alldex = alldex + 10;
					alliint = alliint + 10;
					allweight = allweight + 3685;
					break;
				case 8:
					allhp = allhp + 194;
					allmp = allmp + 58;
					allpv = allpv + 1;
					allstr = allstr + 17;
					alldex = alldex + 10;
					alliint = alliint + 10;
					allweight = allweight + 3710;
					break;
				case 9:
					allhp = allhp + 208;
					allmp = allmp + 59;
					allpv = allpv + 1;
					allstr = allstr + 18;
					alldex = alldex + 10;
					alliint = alliint + 10;
					allweight = allweight + 3765;
					break;
				case 10:
					allhp = allhp + 219;
					allmp = allmp + 60;
					allpv = allpv + 1;
					allstr = allstr + 18;
					alldex = alldex + 10;
					alliint = alliint + 10;
					allweight = allweight + 3790;
					break;
				case 11:
					allhp = allhp + 230;
					allmp = allmp + 61;
					allpv = allpv + 1;
					allstr = allstr + 18;
					alldex = alldex + 10;
					alliint = alliint + 10;
					allweight = allweight + 3815;
					break;
				case 12:
					allhp = allhp + 244;
					allmp = allmp + 62;
					allpv = allpv + 1;
					allstr = allstr + 19;
					alldex = alldex + 10;
					alliint = alliint + 10;
					allweight = allweight + 3870;
					break;
				case 13:
					allhp = allhp + 255;
					allmp = allmp + 63;
					allpv = allpv + 1;
					allstr = allstr + 19;
					alldex = alldex + 10;
					alliint = alliint + 10;
					allweight = allweight + 3895;
					break;
				case 14:
					allhp = allhp + 266;
					allmp = allmp + 64;
					allpv = allpv + 1;
					allstr = allstr + 19;
					alldex = alldex + 10;
					alliint = alliint + 10;
					allweight = allweight + 3920;
					break;
				case 15:
					allhp = allhp + 280;
					allmp = allmp + 67;
					allpv = allpv + 1;
					allstr = allstr + 20;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 3975;
					break;
				case 16:
					allhp = allhp + 291;
					allmp = allmp + 68;
					allpv = allpv + 1;
					allstr = allstr + 20;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 4000;
					break;
				case 17:
					allhp = allhp + 302;
					allmp = allmp + 69;
					allpv = allpv + 1;
					allstr = allstr + 20;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 4025;
					break;
				case 18:
					allhp = allhp + 316;
					allmp = allmp + 70;
					allpv = allpv + 1;
					allstr = allstr + 21;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 4080;
					break;
				case 19:
					allhp = allhp + 327;
					allmp = allmp + 71;
					allpv = allpv + 1;
					allstr = allstr + 21;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 4105;
					break;
				case 20:
					allhp = allhp + 338;
					allmp = allmp + 72;
					allpv = allpv + 1;
					allstr = allstr + 21;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 4130;
					break;
				case 21:
					allhp = allhp + 352;
					allmp = allmp + 73;
					allpv = allpv + 1;
					allstr = allstr + 22;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 4185;
					break;
				case 22:
					allhp = allhp + 363;
					allmp = allmp + 74;
					allpv = allpv + 1;
					allstr = allstr + 22;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 4210;
					break;
				case 23:
					allhp = allhp + 374;
					allmp = allmp + 75;
					allpv = allpv + 1;
					allstr = allstr + 22;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 4235;
					break;
				case 24:
					allhp = allhp + 388;
					allmp = allmp + 76;
					allpv = allpv + 1;
					allstr = allstr + 23;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 4290;
					break;
				case 25:
					allhp = allhp + 399;
					allmp = allmp + 77;
					allpv = allpv + 1;
					allstr = allstr + 23;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 4315;
					break;
				case 26:
					allhp = allhp + 410;
					allmp = allmp + 78;
					allpv = allpv + 1;
					allstr = allstr + 23;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 4340;
					break;
				case 27:
					allhp = allhp + 424;
					allmp = allmp + 79;
					allpv = allpv + 1;
					allstr = allstr + 24;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 4395;
					break;
				case 28:
					allhp = allhp + 435;
					allmp = allmp + 80;
					allpv = allpv + 1;
					allstr = allstr + 24;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 4420;
					break;
				case 29:
					allhp = allhp + 446;
					allmp = allmp + 81;
					allpv = allpv + 1;
					allstr = allstr + 24;
					alldex = alldex + 11;
					alliint = alliint + 11;
					allweight = allweight + 4445;
					break;
				case 30:
					allhp = allhp + 460;
					allmp = allmp + 84;
					allpv = allpv + 1;
					allstr = allstr + 25;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4500;
					break;
				case 31:
					allhp = allhp + 471;
					allmp = allmp + 85;
					allpv = allpv + 1;
					allstr = allstr + 25;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4525;
					break;
				case 32:
					allhp = allhp + 482;
					allmp = allmp + 86;
					allpv = allpv + 1;
					allstr = allstr + 25;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4550;
					break;
				case 33:
					allhp = allhp + 496;
					allmp = allmp + 87;
					allpv = allpv + 1;
					allstr = allstr + 26;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4605;
					break;
				case 34:
					allhp = allhp + 507;
					allmp = allmp + 88;
					allpv = allpv + 1;
					allstr = allstr + 26;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4630;
					break;
				case 35:
					allhp = allhp + 518;
					allmp = allmp + 89;
					allpv = allpv + 1;
					allstr = allstr + 26;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4655;
					break;
				case 36:
					allhp = allhp + 532;
					allmp = allmp + 90;
					allpv = allpv + 1;
					allstr = allstr + 27;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4710;
					break;
				case 37:
					allhp = allhp + 543;
					allmp = allmp + 91;
					allpv = allpv + 1;
					allstr = allstr + 27;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4735;
					break;
				case 38:
					allhp = allhp + 554;
					allmp = allmp + 92;
					allpv = allpv + 1;
					allstr = allstr + 27;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4760;
					break;
				case 39:
					allhp = allhp + 568;
					allmp = allmp + 93;
					allpv = allpv + 1;
					allstr = allstr + 28;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4815;
					break;
				case 40:
					allhp = allhp + 579;
					allmp = allmp + 94;
					allpv = allpv + 1;
					allstr = allstr + 28;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4840;
					break;
				case 41:
					allhp = allhp + 590;
					allmp = allmp + 95;
					allpv = allpv + 1;
					allstr = allstr + 28;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4865;
					break;
				case 42:
					allhp = allhp + 604;
					allmp = allmp + 96;
					allpv = allpv + 1;
					allstr = allstr + 29;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4920;
					break;
				case 43:
					allhp = allhp + 615;
					allmp = allmp + 97;
					allpv = allpv + 1;
					allstr = allstr + 29;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4945;
					break;
				case 44:
					allhp = allhp + 626;
					allmp = allmp + 98;
					allpv = allpv + 1;
					allstr = allstr + 29;
					alldex = alldex + 12;
					alliint = alliint + 12;
					allweight = allweight + 4970;
					break;
				case 45:
					allhp = allhp + 640;
					allmp = allmp + 101;
					allpv = allpv + 1;
					allstr = allstr + 30;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5025;
					break;
				case 46:
					allhp = allhp + 651;
					allmp = allmp + 102;
					allpv = allpv + 1;
					allstr = allstr + 30;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5050;
					break;
				case 47:
					allhp = allhp + 662;
					allmp = allmp + 103;
					allpv = allpv + 1;
					allstr = allstr + 30;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5075;
					break;
				case 48:
					allhp = allhp + 676;
					allmp = allmp + 104;
					allpv = allpv + 1;
					allstr = allstr + 31;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5130;
					break;
				case 49:
					allhp = allhp + 687;
					allmp = allmp + 105;
					allpv = allpv + 1;
					allstr = allstr + 31;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5155;
					break;
				case 50:
					allhp = allhp + 698;
					allmp = allmp + 106;
					allpv = allpv + 1;
					allstr = allstr + 31;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5180;
					break;
				case 51:
					allhp = allhp + 712;
					allmp = allmp + 107;
					allpv = allpv + 1;
					allstr = allstr + 32;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5235;
					break;
				case 52:
					allhp = allhp + 723;
					allmp = allmp + 108;
					allpv = allpv + 1;
					allstr = allstr + 32;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5260;
					break;
				case 53:
					allhp = allhp + 734;
					allmp = allmp + 109;
					allpv = allpv + 1;
					allstr = allstr + 32;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5285;
					break;
				case 54:
					allhp = allhp + 748;
					allmp = allmp + 110;
					allpv = allpv + 1;
					allstr = allstr + 33;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5340;
					break;
				case 55:
					allhp = allhp + 759;
					allmp = allmp + 111;
					allpv = allpv + 1;
					allstr = allstr + 33;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5365;
					break;
				case 56:
					allhp = allhp + 770;
					allmp = allmp + 112;
					allpv = allpv + 1;
					allstr = allstr + 33;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5390;
					break;
				case 57:
					allhp = allhp + 784;
					allmp = allmp + 113;
					allpv = allpv + 1;
					allstr = allstr + 34;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5445;
					break;
				case 58:
					allhp = allhp + 795;
					allmp = allmp + 114;
					allpv = allpv + 1;
					allstr = allstr + 34;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5470;
					break;
				case 59:
					allhp = allhp + 806;
					allmp = allmp + 115;
					allpv = allpv + 1;
					allstr = allstr + 34;
					alldex = alldex + 13;
					alliint = alliint + 13;
					allweight = allweight + 5495;
					break;
				case 60:
					allhp = allhp + 820;
					allmp = allmp + 118;
					allpv = allpv + 1;
					allstr = allstr + 35;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 5550;
					break;
				case 61:
					allhp = allhp + 831;
					allmp = allmp + 119;
					allpv = allpv + 1;
					allstr = allstr + 35;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 5575;
					break;
				case 62:
					allhp = allhp + 842;
					allmp = allmp + 120;
					allpv = allpv + 1;
					allstr = allstr + 35;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 5600;
					break;
				case 63:
					allhp = allhp + 856;
					allmp = allmp + 121;
					allpv = allpv + 1;
					allstr = allstr + 36;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 5655;
					break;
				case 64:
					allhp = allhp + 867;
					allmp = allmp + 122;
					allpv = allpv + 1;
					allstr = allstr + 36;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 5680;
					break;
				case 65:
					allhp = allhp + 878;
					allmp = allmp + 123;
					allpv = allpv + 1;
					allstr = allstr + 36;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 5705;
					break;
				case 66:
					allhp = allhp + 892;
					allmp = allmp + 124;
					allpv = allpv + 1;
					allstr = allstr + 37;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 5760;
					break;
				case 67:
					allhp = allhp + 903;
					allmp = allmp + 125;
					allpv = allpv + 1;
					allstr = allstr + 37;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 5785;
					break;
				case 68:
					allhp = allhp + 914;
					allmp = allmp + 126;
					allpv = allpv + 1;
					allstr = allstr + 37;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 5810;
					break;
				case 69:
					allhp = allhp + 928;
					allmp = allmp + 127;
					allpv = allpv + 1;
					allstr = allstr + 38;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 5865;
					break;
				case 70:
					allhp = allhp + 939;
					allmp = allmp + 128;
					allpv = allpv + 1;
					allstr = allstr + 38;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 5890;
					break;
				case 71:
					allhp = allhp + 950;
					allmp = allmp + 129;
					allpv = allpv + 1;
					allstr = allstr + 38;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 5915;
					break;
				case 72:
					allhp = allhp + 964;
					allmp = allmp + 130;
					allpv = allpv + 1;
					allstr = allstr + 39;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 5970;
					break;
				case 73:
					allhp = allhp + 975;
					allmp = allmp + 131;
					allpv = allpv + 1;
					allstr = allstr + 39;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 5995;
					break;
				case 74:
					allhp = allhp + 986;
					allmp = allmp + 132;
					allpv = allpv + 1;
					allstr = allstr + 39;
					alldex = alldex + 14;
					alliint = alliint + 14;
					allweight = allweight + 6020;
					break;
				case 75:
					allhp = allhp + 1000;
					allmp = allmp + 135;
					allpv = allpv + 1;
					allstr = allstr + 40;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6075;
					break;
				case 76:
					allhp = allhp + 1011;
					allmp = allmp + 136;
					allpv = allpv + 1;
					allstr = allstr + 40;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6100;
					break;
				case 77:
					allhp = allhp + 1022;
					allmp = allmp + 137;
					allpv = allpv + 1;
					allstr = allstr + 40;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6125;
					break;
				case 78:
					allhp = allhp + 1036;
					allmp = allmp + 138;
					allpv = allpv + 1;
					allstr = allstr + 41;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6180;
					break;
				case 79:
					allhp = allhp + 1047;
					allmp = allmp + 139;
					allpv = allpv + 1;
					allstr = allstr + 41;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6205;
					break;
				case 80:
					allhp = allhp + 1058;
					allmp = allmp + 140;
					allpv = allpv + 1;
					allstr = allstr + 41;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6230;
					break;
				case 81:
					allhp = allhp + 1072;
					allmp = allmp + 141;
					allpv = allpv + 1;
					allstr = allstr + 42;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6285;
					break;
				case 82:
					allhp = allhp + 1083;
					allmp = allmp + 142;
					allpv = allpv + 1;
					allstr = allstr + 42;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6310;
					break;
				case 83:
					allhp = allhp + 1094;
					allmp = allmp + 143;
					allpv = allpv + 1;
					allstr = allstr + 42;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6335;
					break;
				case 84:
					allhp = allhp + 1108;
					allmp = allmp + 144;
					allpv = allpv + 1;
					allstr = allstr + 43;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6390;
					break;
				case 85:
					allhp = allhp + 1119;
					allmp = allmp + 145;
					allpv = allpv + 1;
					allstr = allstr + 43;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6415;
					break;
				case 86:
					allhp = allhp + 1130;
					allmp = allmp + 146;
					allpv = allpv + 1;
					allstr = allstr + 43;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6440;
					break;
				case 87:
					allhp = allhp + 1144;
					allmp = allmp + 147;
					allpv = allpv + 1;
					allstr = allstr + 44;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6495;
					break;
				case 88:
					allhp = allhp + 1155;
					allmp = allmp + 148;
					allpv = allpv + 1;
					allstr = allstr + 44;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6520;
					break;
				case 89:
					allhp = allhp + 1166;
					allmp = allmp + 149;
					allpv = allpv + 1;
					allstr = allstr + 44;
					alldex = alldex + 15;
					alliint = alliint + 15;
					allweight = allweight + 6545;
					break;
				case 90:
					allhp = allhp + 1180;
					allmp = allmp + 152;
					allpv = allpv + 1;
					allstr = allstr + 45;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 6600;
					break;
				case 91:
					allhp = allhp + 1191;
					allmp = allmp + 153;
					allpv = allpv + 1;
					allstr = allstr + 45;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 6625;
					break;
				case 92:
					allhp = allhp + 1202;
					allmp = allmp + 154;
					allpv = allpv + 1;
					allstr = allstr + 45;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 6650;
					break;
				case 93:
					allhp = allhp + 1216;
					allmp = allmp + 155;
					allpv = allpv + 1;
					allstr = allstr + 46;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 6705;
					break;
				case 94:
					allhp = allhp + 1227;
					allmp = allmp + 156;
					allpv = allpv + 1;
					allstr = allstr + 46;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 6730;
					break;
				case 95:
					allhp = allhp + 1238;
					allmp = allmp + 157;
					allpv = allpv + 1;
					allstr = allstr + 46;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 6755;
					break;
				case 96:
					allhp = allhp + 1252;
					allmp = allmp + 158;
					allpv = allpv + 1;
					allstr = allstr + 47;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 6810;
					break;
				case 97:
					allhp = allhp + 1263;
					allmp = allmp + 159;
					allpv = allpv + 1;
					allstr = allstr + 47;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 6835;
					break;
				case 98:
					allhp = allhp + 1274;
					allmp = allmp + 160;
					allpv = allpv + 1;
					allstr = allstr + 47;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 6860;
					break;
				case 99:
					allhp = allhp + 1288;
					allmp = allmp + 161;
					allpv = allpv + 1;
					allstr = allstr + 48;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 6915;
					break;
				case 100:
					allhp = allhp + 1299;
					allmp = allmp + 162;
					allpv = allpv + 1;
					allstr = allstr + 48;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 6940;
					break;
				case 101:
					allhp = allhp + 1310;
					allmp = allmp + 173;
					allpv = allpv + 1;
					allstr = allstr + 48;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 7365;
					break;
				case 102:
					allhp = allhp + 1324;
					allmp = allmp + 184;
					allpv = allpv + 1;
					allstr = allstr + 49;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 7820;
					break;
				case 103:
					allhp = allhp + 1335;
					allmp = allmp + 195;
					allpv = allpv + 1;
					allstr = allstr + 49;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 8245;
					break;
				case 104:
					allhp = allhp + 1346;
					allmp = allmp + 206;
					allpv = allpv + 1;
					allstr = allstr + 49;
					alldex = alldex + 16;
					alliint = alliint + 16;
					allweight = allweight + 8670;
					break;
				case 105:
					allhp = allhp + 1360;
					allmp = allmp + 219;
					allpv = allpv + 1;
					allstr = allstr + 50;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 9125;
					break;
				case 106:
					allhp = allhp + 1371;
					allmp = allmp + 230;
					allpv = allpv + 1;
					allstr = allstr + 50;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 9550;
					break;
				case 107:
					allhp = allhp + 1382;
					allmp = allmp + 241;
					allpv = allpv + 1;
					allstr = allstr + 50;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 9975;
					break;
				case 108:
					allhp = allhp + 1396;
					allmp = allmp + 252;
					allpv = allpv + 1;
					allstr = allstr + 51;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 10430;
					break;
				case 109:
					allhp = allhp + 1407;
					allmp = allmp + 263;
					allpv = allpv + 1;
					allstr = allstr + 51;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 10855;
					break;
				case 110:
					allhp = allhp + 1418;
					allmp = allmp + 274;
					allpv = allpv + 1;
					allstr = allstr + 51;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 11280;
					break;
				case 111:
					allhp = allhp + 1432;
					allmp = allmp + 285;
					allpv = allpv + 1;
					allstr = allstr + 52;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 11735;
					break;
				case 112:
					allhp = allhp + 1443;
					allmp = allmp + 296;
					allpv = allpv + 1;
					allstr = allstr + 52;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 12160;
					break;
				case 113:
					allhp = allhp + 1454;
					allmp = allmp + 307;
					allpv = allpv + 1;
					allstr = allstr + 52;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 12585;
					break;
				case 114:
					allhp = allhp + 1468;
					allmp = allmp + 318;
					allpv = allpv + 1;
					allstr = allstr + 53;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 13040;
					break;
				case 115:
					allhp = allhp + 1479;
					allmp = allmp + 329;
					allpv = allpv + 1;
					allstr = allstr + 53;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 13465;
					break;
				case 116:
					allhp = allhp + 1490;
					allmp = allmp + 340;
					allpv = allpv + 1;
					allstr = allstr + 53;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 13890;
					break;
				case 117:
					allhp = allhp + 1504;
					allmp = allmp + 351;
					allpv = allpv + 1;
					allstr = allstr + 54;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 14345;
					break;
				case 118:
					allhp = allhp + 1515;
					allmp = allmp + 362;
					allpv = allpv + 1;
					allstr = allstr + 54;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 14770;
					break;
				case 119:
					allhp = allhp + 1526;
					allmp = allmp + 373;
					allpv = allpv + 1;
					allstr = allstr + 54;
					alldex = alldex + 17;
					alliint = alliint + 17;
					allweight = allweight + 15195;
					break;
				case 120:
					allhp = allhp + 1540;
					allmp = allmp + 386;
					allpv = allpv + 1;
					allstr = allstr + 55;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 15650;
					break;
				case 121:
					allhp = allhp + 1551;
					allmp = allmp + 397;
					allpv = allpv + 1;
					allstr = allstr + 55;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 16075;
					break;
				case 122:
					allhp = allhp + 1562;
					allmp = allmp + 408;
					allpv = allpv + 1;
					allstr = allstr + 55;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 16500;
					break;
				case 123:
					allhp = allhp + 1576;
					allmp = allmp + 419;
					allpv = allpv + 1;
					allstr = allstr + 56;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 16955;
					break;
				case 124:
					allhp = allhp + 1587;
					allmp = allmp + 430;
					allpv = allpv + 1;
					allstr = allstr + 56;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 17380;
					break;
				case 125:
					allhp = allhp + 1598;
					allmp = allmp + 441;
					allpv = allpv + 1;
					allstr = allstr + 56;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 17805;
					break;
				case 126:
					allhp = allhp + 1612;
					allmp = allmp + 452;
					allpv = allpv + 1;
					allstr = allstr + 57;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 18260;
					break;
				case 127:
					allhp = allhp + 1623;
					allmp = allmp + 463;
					allpv = allpv + 1;
					allstr = allstr + 57;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 18685;
					break;
				case 128:
					allhp = allhp + 1634;
					allmp = allmp + 474;
					allpv = allpv + 1;
					allstr = allstr + 57;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 19110;
					break;
				case 129:
					allhp = allhp + 1648;
					allmp = allmp + 485;
					allpv = allpv + 1;
					allstr = allstr + 58;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 19565;
					break;
				case 130:
					allhp = allhp + 1659;
					allmp = allmp + 496;
					allpv = allpv + 1;
					allstr = allstr + 58;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 19990;
					break;
				case 131:
					allhp = allhp + 1670;
					allmp = allmp + 507;
					allpv = allpv + 1;
					allstr = allstr + 58;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 20415;
					break;
				case 132:
					allhp = allhp + 1684;
					allmp = allmp + 518;
					allpv = allpv + 1;
					allstr = allstr + 59;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 20870;
					break;
				case 133:
					allhp = allhp + 1695;
					allmp = allmp + 529;
					allpv = allpv + 1;
					allstr = allstr + 59;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 21295;
					break;
				case 134:
					allhp = allhp + 1706;
					allmp = allmp + 540;
					allpv = allpv + 1;
					allstr = allstr + 59;
					alldex = alldex + 18;
					alliint = alliint + 18;
					allweight = allweight + 21720;
					break;
				case 135:
					allhp = allhp + 1720;
					allmp = allmp + 553;
					allpv = allpv + 1;
					allstr = allstr + 60;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 22175;
					break;
				case 136:
					allhp = allhp + 1731;
					allmp = allmp + 564;
					allpv = allpv + 1;
					allstr = allstr + 60;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 22600;
					break;
				case 137:
					allhp = allhp + 1742;
					allmp = allmp + 575;
					allpv = allpv + 1;
					allstr = allstr + 60;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 23025;
					break;
				case 138:
					allhp = allhp + 1756;
					allmp = allmp + 586;
					allpv = allpv + 1;
					allstr = allstr + 61;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 23480;
					break;
				case 139:
					allhp = allhp + 1767;
					allmp = allmp + 597;
					allpv = allpv + 1;
					allstr = allstr + 61;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 23905;
					break;
				case 140:
					allhp = allhp + 1778;
					allmp = allmp + 608;
					allpv = allpv + 1;
					allstr = allstr + 61;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 24330;
					break;
				case 141:
					allhp = allhp + 1792;
					allmp = allmp + 619;
					allpv = allpv + 1;
					allstr = allstr + 62;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 24785;
					break;
				case 142:
					allhp = allhp + 1803;
					allmp = allmp + 630;
					allpv = allpv + 1;
					allstr = allstr + 62;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 25210;
					break;
				case 143:
					allhp = allhp + 1814;
					allmp = allmp + 641;
					allpv = allpv + 1;
					allstr = allstr + 62;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 25635;
					break;
				case 144:
					allhp = allhp + 1828;
					allmp = allmp + 652;
					allpv = allpv + 1;
					allstr = allstr + 63;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 26090;
					break;
				case 145:
					allhp = allhp + 1839;
					allmp = allmp + 663;
					allpv = allpv + 1;
					allstr = allstr + 63;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 26515;
					break;
				case 146:
					allhp = allhp + 1850;
					allmp = allmp + 674;
					allpv = allpv + 1;
					allstr = allstr + 63;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 26940;
					break;
				case 147:
					allhp = allhp + 1864;
					allmp = allmp + 685;
					allpv = allpv + 1;
					allstr = allstr + 64;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 27395;
					break;
				case 148:
					allhp = allhp + 1875;
					allmp = allmp + 696;
					allpv = allpv + 1;
					allstr = allstr + 64;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 27820;
					break;
				case 149:
					allhp = allhp + 1886;
					allmp = allmp + 707;
					allpv = allpv + 1;
					allstr = allstr + 64;
					alldex = alldex + 19;
					alliint = alliint + 19;
					allweight = allweight + 28245;
					break;
				case 150:
					allhp = allhp + 1900;
					allmp = allmp + 720;
					allpv = allpv + 1;
					allstr = allstr + 65;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 28700;
					break;
				case 151:
					allhp = allhp + 1911;
					allmp = allmp + 731;
					allpv = allpv + 1;
					allstr = allstr + 65;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 29125;
					break;
				case 152:
					allhp = allhp + 1922;
					allmp = allmp + 742;
					allpv = allpv + 1;
					allstr = allstr + 65;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 29550;
					break;
				case 153:
					allhp = allhp + 1936;
					allmp = allmp + 753;
					allpv = allpv + 1;
					allstr = allstr + 66;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 30005;
					break;
				case 154:
					allhp = allhp + 1947;
					allmp = allmp + 764;
					allpv = allpv + 1;
					allstr = allstr + 66;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 30430;
					break;
				case 155:
					allhp = allhp + 1958;
					allmp = allmp + 775;
					allpv = allpv + 1;
					allstr = allstr + 66;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 30855;
					break;
				case 156:
					allhp = allhp + 1972;
					allmp = allmp + 786;
					allpv = allpv + 1;
					allstr = allstr + 67;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 31310;
					break;
				case 157:
					allhp = allhp + 1983;
					allmp = allmp + 797;
					allpv = allpv + 1;
					allstr = allstr + 67;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 31735;
					break;
				case 158:
					allhp = allhp + 1994;
					allmp = allmp + 808;
					allpv = allpv + 1;
					allstr = allstr + 67;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 32160;
					break;
				case 159:
					allhp = allhp + 2008;
					allmp = allmp + 819;
					allpv = allpv + 1;
					allstr = allstr + 68;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 32615;
					break;
				case 160:
					allhp = allhp + 2019;
					allmp = allmp + 830;
					allpv = allpv + 1;
					allstr = allstr + 68;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 33040;
					break;
				case 161:
					allhp = allhp + 2030;
					allmp = allmp + 841;
					allpv = allpv + 1;
					allstr = allstr + 68;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 33465;
					break;
				case 162:
					allhp = allhp + 2044;
					allmp = allmp + 852;
					allpv = allpv + 1;
					allstr = allstr + 69;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 33920;
					break;
				case 163:
					allhp = allhp + 2055;
					allmp = allmp + 863;
					allpv = allpv + 1;
					allstr = allstr + 69;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 34345;
					break;
				case 164:
					allhp = allhp + 2066;
					allmp = allmp + 874;
					allpv = allpv + 1;
					allstr = allstr + 69;
					alldex = alldex + 20;
					alliint = alliint + 20;
					allweight = allweight + 34770;
					break;
				case 165:
					allhp = allhp + 2080;
					allmp = allmp + 887;
					allpv = allpv + 1;
					allstr = allstr + 70;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 35225;
					break;
				case 166:
					allhp = allhp + 2091;
					allmp = allmp + 898;
					allpv = allpv + 1;
					allstr = allstr + 70;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 35650;
					break;
				case 167:
					allhp = allhp + 2102;
					allmp = allmp + 909;
					allpv = allpv + 1;
					allstr = allstr + 70;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 36075;
					break;
				case 168:
					allhp = allhp + 2116;
					allmp = allmp + 920;
					allpv = allpv + 1;
					allstr = allstr + 71;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 36530;
					break;
				case 169:
					allhp = allhp + 2127;
					allmp = allmp + 931;
					allpv = allpv + 1;
					allstr = allstr + 71;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 36955;
					break;
				case 170:
					allhp = allhp + 2138;
					allmp = allmp + 942;
					allpv = allpv + 1;
					allstr = allstr + 71;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 37380;
					break;
				case 171:
					allhp = allhp + 2152;
					allmp = allmp + 953;
					allpv = allpv + 1;
					allstr = allstr + 72;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 37835;
					break;
				case 172:
					allhp = allhp + 2163;
					allmp = allmp + 964;
					allpv = allpv + 1;
					allstr = allstr + 72;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 38260;
					break;
				case 173:
					allhp = allhp + 2174;
					allmp = allmp + 975;
					allpv = allpv + 1;
					allstr = allstr + 72;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 38685;
					break;
				case 174:
					allhp = allhp + 2188;
					allmp = allmp + 986;
					allpv = allpv + 1;
					allstr = allstr + 73;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 39140;
					break;
				case 175:
					allhp = allhp + 2199;
					allmp = allmp + 997;
					allpv = allpv + 1;
					allstr = allstr + 73;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 39565;
					break;
				case 176:
					allhp = allhp + 2210;
					allmp = allmp + 1008;
					allpv = allpv + 1;
					allstr = allstr + 73;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 39990;
					break;
				case 177:
					allhp = allhp + 2224;
					allmp = allmp + 1019;
					allpv = allpv + 1;
					allstr = allstr + 74;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 40445;
					break;
				case 178:
					allhp = allhp + 2235;
					allmp = allmp + 1030;
					allpv = allpv + 1;
					allstr = allstr + 74;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 40870;
					break;
				case 179:
					allhp = allhp + 2246;
					allmp = allmp + 1041;
					allpv = allpv + 1;
					allstr = allstr + 74;
					alldex = alldex + 21;
					alliint = alliint + 21;
					allweight = allweight + 41295;
					break;
				case 180:
					allhp = allhp + 2260;
					allmp = allmp + 1054;
					allpv = allpv + 1;
					allstr = allstr + 75;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 41750;
					break;
				case 181:
					allhp = allhp + 2271;
					allmp = allmp + 1065;
					allpv = allpv + 1;
					allstr = allstr + 75;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 42175;
					break;
				case 182:
					allhp = allhp + 2282;
					allmp = allmp + 1076;
					allpv = allpv + 1;
					allstr = allstr + 75;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 42600;
					break;
				case 183:
					allhp = allhp + 2296;
					allmp = allmp + 1087;
					allpv = allpv + 1;
					allstr = allstr + 76;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 43055;
					break;
				case 184:
					allhp = allhp + 2307;
					allmp = allmp + 1098;
					allpv = allpv + 1;
					allstr = allstr + 76;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 43480;
					break;
				case 185:
					allhp = allhp + 2318;
					allmp = allmp + 1109;
					allpv = allpv + 1;
					allstr = allstr + 76;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 43905;
					break;
				case 186:
					allhp = allhp + 2332;
					allmp = allmp + 1120;
					allpv = allpv + 1;
					allstr = allstr + 77;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 44360;
					break;
				case 187:
					allhp = allhp + 2343;
					allmp = allmp + 1131;
					allpv = allpv + 1;
					allstr = allstr + 77;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 44785;
					break;
				case 188:
					allhp = allhp + 2354;
					allmp = allmp + 1142;
					allpv = allpv + 1;
					allstr = allstr + 77;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 45210;
					break;
				case 189:
					allhp = allhp + 2368;
					allmp = allmp + 1153;
					allpv = allpv + 1;
					allstr = allstr + 78;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 45665;
					break;
				case 190:
					allhp = allhp + 2379;
					allmp = allmp + 1164;
					allpv = allpv + 1;
					allstr = allstr + 78;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 46090;
					break;
				case 191:
					allhp = allhp + 2390;
					allmp = allmp + 1175;
					allpv = allpv + 1;
					allstr = allstr + 78;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 46515;
					break;
				case 192:
					allhp = allhp + 2404;
					allmp = allmp + 1186;
					allpv = allpv + 1;
					allstr = allstr + 79;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 46970;
					break;
				case 193:
					allhp = allhp + 2415;
					allmp = allmp + 1197;
					allpv = allpv + 1;
					allstr = allstr + 79;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 47395;
					break;
				case 194:
					allhp = allhp + 2426;
					allmp = allmp + 1208;
					allpv = allpv + 1;
					allstr = allstr + 79;
					alldex = alldex + 22;
					alliint = alliint + 22;
					allweight = allweight + 47820;
					break;
				case 195:
					allhp = allhp + 2440;
					allmp = allmp + 1221;
					allpv = allpv + 1;
					allstr = allstr + 80;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 48275;
					break;
				case 196:
					allhp = allhp + 2451;
					allmp = allmp + 1232;
					allpv = allpv + 1;
					allstr = allstr + 80;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 48700;
					break;
				case 197:
					allhp = allhp + 2462;
					allmp = allmp + 1243;
					allpv = allpv + 1;
					allstr = allstr + 80;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 49125;
					break;
				case 198:
					allhp = allhp + 2476;
					allmp = allmp + 1254;
					allpv = allpv + 1;
					allstr = allstr + 81;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 49580;
					break;
				case 199:
					allhp = allhp + 2487;
					allmp = allmp + 1265;
					allpv = allpv + 1;
					allstr = allstr + 81;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 50005;
					break;
				case 200:
					allhp = allhp + 2498;
					allmp = allmp + 1276;
					allpv = allpv + 1;
					allstr = allstr + 81;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 50430;
					break;
				case 201:
					allhp = allhp + 2512;
					allmp = allmp + 1287;
					allpv = allpv + 1;
					allstr = allstr + 82;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 50885;
					break;
				case 202:
					allhp = allhp + 2523;
					allmp = allmp + 1298;
					allpv = allpv + 1;
					allstr = allstr + 82;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 51310;
					break;
				case 203:
					allhp = allhp + 2534;
					allmp = allmp + 1309;
					allpv = allpv + 1;
					allstr = allstr + 82;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 51735;
					break;
				case 204:
					allhp = allhp + 2548;
					allmp = allmp + 1320;
					allpv = allpv + 1;
					allstr = allstr + 83;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 52190;
					break;
				case 205:
					allhp = allhp + 2559;
					allmp = allmp + 1331;
					allpv = allpv + 1;
					allstr = allstr + 83;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 52615;
					break;
				case 206:
					allhp = allhp + 2570;
					allmp = allmp + 1342;
					allpv = allpv + 1;
					allstr = allstr + 83;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 53040;
					break;
				case 207:
					allhp = allhp + 2584;
					allmp = allmp + 1353;
					allpv = allpv + 1;
					allstr = allstr + 84;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 53495;
					break;
				case 208:
					allhp = allhp + 2595;
					allmp = allmp + 1364;
					allpv = allpv + 1;
					allstr = allstr + 84;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 53920;
					break;
				case 209:
					allhp = allhp + 2606;
					allmp = allmp + 1375;
					allpv = allpv + 1;
					allstr = allstr + 84;
					alldex = alldex + 23;
					alliint = alliint + 23;
					allweight = allweight + 54345;
					break;
				case 210:
					allhp = allhp + 2620;
					allmp = allmp + 1388;
					allpv = allpv + 1;
					allstr = allstr + 85;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 54800;
					break;
				case 211:
					allhp = allhp + 2631;
					allmp = allmp + 1399;
					allpv = allpv + 1;
					allstr = allstr + 85;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 55225;
					break;
				case 212:
					allhp = allhp + 2642;
					allmp = allmp + 1410;
					allpv = allpv + 1;
					allstr = allstr + 85;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 55650;
					break;
				case 213:
					allhp = allhp + 2656;
					allmp = allmp + 1421;
					allpv = allpv + 1;
					allstr = allstr + 86;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 56105;
					break;
				case 214:
					allhp = allhp + 2667;
					allmp = allmp + 1432;
					allpv = allpv + 1;
					allstr = allstr + 86;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 56530;
					break;
				case 215:
					allhp = allhp + 2678;
					allmp = allmp + 1443;
					allpv = allpv + 1;
					allstr = allstr + 86;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 56955;
					break;
				case 216:
					allhp = allhp + 2692;
					allmp = allmp + 1454;
					allpv = allpv + 1;
					allstr = allstr + 87;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 57410;
					break;
				case 217:
					allhp = allhp + 2703;
					allmp = allmp + 1465;
					allpv = allpv + 1;
					allstr = allstr + 87;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 57835;
					break;
				case 218:
					allhp = allhp + 2714;
					allmp = allmp + 1476;
					allpv = allpv + 1;
					allstr = allstr + 87;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 58260;
					break;
				case 219:
					allhp = allhp + 2728;
					allmp = allmp + 1487;
					allpv = allpv + 1;
					allstr = allstr + 88;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 58715;
					break;
				case 220:
					allhp = allhp + 2739;
					allmp = allmp + 1498;
					allpv = allpv + 1;
					allstr = allstr + 88;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 59140;
					break;
				case 221:
					allhp = allhp + 2750;
					allmp = allmp + 1509;
					allpv = allpv + 1;
					allstr = allstr + 88;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 59565;
					break;
				case 222:
					allhp = allhp + 2764;
					allmp = allmp + 1520;
					allpv = allpv + 1;
					allstr = allstr + 89;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 60020;
					break;
				case 223:
					allhp = allhp + 2775;
					allmp = allmp + 1531;
					allpv = allpv + 1;
					allstr = allstr + 89;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 60445;
					break;
				case 224:
					allhp = allhp + 2786;
					allmp = allmp + 1542;
					allpv = allpv + 1;
					allstr = allstr + 89;
					alldex = alldex + 24;
					alliint = alliint + 24;
					allweight = allweight + 60870;
					break;
				case 225:
					allhp = allhp + 2800;
					allmp = allmp + 1555;
					allpv = allpv + 1;
					allstr = allstr + 90;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 61325;
					break;
				case 226:
					allhp = allhp + 2811;
					allmp = allmp + 1566;
					allpv = allpv + 1;
					allstr = allstr + 90;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 61750;
					break;
				case 227:
					allhp = allhp + 2822;
					allmp = allmp + 1577;
					allpv = allpv + 1;
					allstr = allstr + 90;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 62175;
					break;
				case 228:
					allhp = allhp + 2836;
					allmp = allmp + 1588;
					allpv = allpv + 1;
					allstr = allstr + 91;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 62630;
					break;
				case 229:
					allhp = allhp + 2847;
					allmp = allmp + 1599;
					allpv = allpv + 1;
					allstr = allstr + 91;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 63055;
					break;
				case 230:
					allhp = allhp + 2858;
					allmp = allmp + 1610;
					allpv = allpv + 1;
					allstr = allstr + 91;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 63480;
					break;
				case 231:
					allhp = allhp + 2872;
					allmp = allmp + 1621;
					allpv = allpv + 1;
					allstr = allstr + 92;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 63935;
					break;
				case 232:
					allhp = allhp + 2883;
					allmp = allmp + 1632;
					allpv = allpv + 1;
					allstr = allstr + 92;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 64360;
					break;
				case 233:
					allhp = allhp + 2894;
					allmp = allmp + 1643;
					allpv = allpv + 1;
					allstr = allstr + 92;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 64785;
					break;
				case 234:
					allhp = allhp + 2908;
					allmp = allmp + 1654;
					allpv = allpv + 1;
					allstr = allstr + 93;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 65240;
					break;
				case 235:
					allhp = allhp + 2919;
					allmp = allmp + 1665;
					allpv = allpv + 1;
					allstr = allstr + 93;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 65665;
					break;
				case 236:
					allhp = allhp + 2930;
					allmp = allmp + 1676;
					allpv = allpv + 1;
					allstr = allstr + 93;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 66090;
					break;
				case 237:
					allhp = allhp + 2944;
					allmp = allmp + 1687;
					allpv = allpv + 1;
					allstr = allstr + 94;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 66545;
					break;
				case 238:
					allhp = allhp + 2955;
					allmp = allmp + 1698;
					allpv = allpv + 1;
					allstr = allstr + 94;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 66970;
					break;
				case 239:
					allhp = allhp + 2966;
					allmp = allmp + 1709;
					allpv = allpv + 1;
					allstr = allstr + 94;
					alldex = alldex + 25;
					alliint = alliint + 25;
					allweight = allweight + 67395;
					break;
				case 240:
					allhp = allhp + 2980;
					allmp = allmp + 1722;
					allpv = allpv + 1;
					allstr = allstr + 95;
					alldex = alldex + 26;
					alliint = alliint + 26;
					allweight = allweight + 67850;
					break;
				case 241:
					allhp = allhp + 2991;
					allmp = allmp + 1733;
					allpv = allpv + 1;
					allstr = allstr + 95;
					alldex = alldex + 26;
					alliint = alliint + 26;
					allweight = allweight + 68275;
					break;
				case 242:
					allhp = allhp + 3002;
					allmp = allmp + 1744;
					allpv = allpv + 1;
					allstr = allstr + 95;
					alldex = alldex + 26;
					alliint = alliint + 26;
					allweight = allweight + 68700;
					break;
				case 243:
					allhp = allhp + 3016;
					allmp = allmp + 1755;
					allpv = allpv + 1;
					allstr = allstr + 96;
					alldex = alldex + 26;
					alliint = alliint + 26;
					allweight = allweight + 69155;
					break;
				case 244:
					allhp = allhp + 3027;
					allmp = allmp + 1766;
					allpv = allpv + 1;
					allstr = allstr + 96;
					alldex = alldex + 26;
					alliint = alliint + 26;
					allweight = allweight + 69580;
					break;
				case 245:
					allhp = allhp + 3038;
					allmp = allmp + 1777;
					allpv = allpv + 1;
					allstr = allstr + 96;
					alldex = alldex + 26;
					alliint = alliint + 26;
					allweight = allweight + 70005;
					break;
				case 246:
					allhp = allhp + 3052;
					allmp = allmp + 1788;
					allpv = allpv + 1;
					allstr = allstr + 97;
					alldex = alldex + 26;
					alliint = alliint + 26;
					allweight = allweight + 70460;
					break;
				case 247:
					allhp = allhp + 3063;
					allmp = allmp + 1799;
					allpv = allpv + 1;
					allstr = allstr + 97;
					alldex = alldex + 26;
					alliint = alliint + 26;
					allweight = allweight + 70885;
					break;
				case 248:
					allhp = allhp + 3074;
					allmp = allmp + 1810;
					allpv = allpv + 1;
					allstr = allstr + 97;
					alldex = alldex + 26;
					alliint = alliint + 26;
					allweight = allweight + 71310;
					break;
				case 249:
					allhp = allhp + 3088;
					allmp = allmp + 1821;
					allpv = allpv + 1;
					allstr = allstr + 98;
					alldex = alldex + 26;
					alliint = alliint + 26;
					allweight = allweight + 71765;
					break;
				case 250:
					allhp = allhp + 3099;
					allmp = allmp + 1832;
					allpv = allpv + 1;
					allstr = allstr + 98;
					alldex = alldex + 26;
					alliint = alliint + 26;
					allweight = allweight + 72190;
					break;
                default:
                    alert("Level must be 1-250");
            }
        }

        if (iclass === 1) {
            allhp = allhp + allstr * 3;
            allweight = allweight + allstr * 30;
            allmp = allmp + alliint * 2;
            if (alldex % 3 == 0) {
                allpv = allpv + (alldex / 3);
            }

            switch (parseInt(level)) {
				case 1:
					allhp = allhp + 79;
					allmp = allmp + 51;
					allpv = allpv + 1;
					allstr = allstr + 10;
					alldex = alldex + 15;
					alliint = alliint + 10;
					allweight = allweight + 3315;
					break;
				case 2:
					allhp = allhp + 88;
					allmp = allmp + 52;
					allpv = allpv + 1;
					allstr = allstr + 10;
					alldex = alldex + 15;
					alliint = alliint + 10;
					allweight = allweight + 3330;
					break;
				case 3:
					allhp = allhp + 97;
					allmp = allmp + 53;
					allpv = allpv + 1;
					allstr = allstr + 10;
					alldex = alldex + 16;
					alliint = alliint + 10;
					allweight = allweight + 3345;
					break;
				case 4:
					allhp = allhp + 106;
					allmp = allmp + 54;
					allpv = allpv + 1;
					allstr = allstr + 10;
					alldex = alldex + 16;
					alliint = alliint + 10;
					allweight = allweight + 3360;
					break;
				case 5:
					allhp = allhp + 115;
					allmp = allmp + 55;
					allpv = allpv + 1;
					allstr = allstr + 10;
					alldex = alldex + 16;
					alliint = alliint + 10;
					allweight = allweight + 3375;
					break;
				case 6:
					allhp = allhp + 124;
					allmp = allmp + 56;
					allpv = allpv + 1;
					allstr = allstr + 10;
					alldex = alldex + 17;
					alliint = alliint + 10;
					allweight = allweight + 3390;
					break;
				case 7:
					allhp = allhp + 133;
					allmp = allmp + 57;
					allpv = allpv + 1;
					allstr = allstr + 10;
					alldex = alldex + 17;
					alliint = alliint + 10;
					allweight = allweight + 3405;
					break;
				case 8:
					allhp = allhp + 142;
					allmp = allmp + 58;
					allpv = allpv + 1;
					allstr = allstr + 10;
					alldex = alldex + 17;
					alliint = alliint + 10;
					allweight = allweight + 3420;
					break;
				case 9:
					allhp = allhp + 151;
					allmp = allmp + 59;
					allpv = allpv + 2;
					allstr = allstr + 10;
					alldex = alldex + 18;
					alliint = alliint + 10;
					allweight = allweight + 3435;
					break;
				case 10:
					allhp = allhp + 160;
					allmp = allmp + 60;
					allpv = allpv + 2;
					allstr = allstr + 10;
					alldex = alldex + 18;
					alliint = alliint + 10;
					allweight = allweight + 3450;
					break;
				case 11:
					allhp = allhp + 169;
					allmp = allmp + 61;
					allpv = allpv + 2;
					allstr = allstr + 10;
					alldex = alldex + 18;
					alliint = alliint + 10;
					allweight = allweight + 3465;
					break;
				case 12:
					allhp = allhp + 178;
					allmp = allmp + 62;
					allpv = allpv + 2;
					allstr = allstr + 10;
					alldex = alldex + 19;
					alliint = alliint + 10;
					allweight = allweight + 3480;
					break;
				case 13:
					allhp = allhp + 190;
					allmp = allmp + 63;
					allpv = allpv + 2;
					allstr = allstr + 11;
					alldex = alldex + 19;
					alliint = alliint + 10;
					allweight = allweight + 3525;
					break;
				case 14:
					allhp = allhp + 199;
					allmp = allmp + 64;
					allpv = allpv + 2;
					allstr = allstr + 11;
					alldex = alldex + 19;
					alliint = alliint + 10;
					allweight = allweight + 3540;
					break;
				case 15:
					allhp = allhp + 208;
					allmp = allmp + 67;
					allpv = allpv + 2;
					allstr = allstr + 11;
					alldex = alldex + 20;
					alliint = alliint + 11;
					allweight = allweight + 3555;
					break;
				case 16:
					allhp = allhp + 217;
					allmp = allmp + 68;
					allpv = allpv + 2;
					allstr = allstr + 11;
					alldex = alldex + 20;
					alliint = alliint + 11;
					allweight = allweight + 3570;
					break;
				case 17:
					allhp = allhp + 226;
					allmp = allmp + 69;
					allpv = allpv + 2;
					allstr = allstr + 11;
					alldex = alldex + 20;
					alliint = alliint + 11;
					allweight = allweight + 3585;
					break;
				case 18:
					allhp = allhp + 235;
					allmp = allmp + 70;
					allpv = allpv + 3;
					allstr = allstr + 11;
					alldex = alldex + 21;
					alliint = alliint + 11;
					allweight = allweight + 3600;
					break;
				case 19:
					allhp = allhp + 244;
					allmp = allmp + 71;
					allpv = allpv + 3;
					allstr = allstr + 11;
					alldex = alldex + 21;
					alliint = alliint + 11;
					allweight = allweight + 3615;
					break;
				case 20:
					allhp = allhp + 253;
					allmp = allmp + 72;
					allpv = allpv + 3;
					allstr = allstr + 11;
					alldex = alldex + 21;
					alliint = alliint + 11;
					allweight = allweight + 3630;
					break;
				case 21:
					allhp = allhp + 262;
					allmp = allmp + 73;
					allpv = allpv + 3;
					allstr = allstr + 11;
					alldex = alldex + 22;
					alliint = alliint + 11;
					allweight = allweight + 3645;
					break;
				case 22:
					allhp = allhp + 271;
					allmp = allmp + 74;
					allpv = allpv + 3;
					allstr = allstr + 11;
					alldex = alldex + 22;
					alliint = alliint + 11;
					allweight = allweight + 3660;
					break;
				case 23:
					allhp = allhp + 280;
					allmp = allmp + 75;
					allpv = allpv + 3;
					allstr = allstr + 11;
					alldex = alldex + 22;
					alliint = alliint + 11;
					allweight = allweight + 3675;
					break;
				case 24:
					allhp = allhp + 289;
					allmp = allmp + 76;
					allpv = allpv + 3;
					allstr = allstr + 11;
					alldex = alldex + 23;
					alliint = alliint + 11;
					allweight = allweight + 3690;
					break;
				case 25:
					allhp = allhp + 298;
					allmp = allmp + 77;
					allpv = allpv + 3;
					allstr = allstr + 11;
					alldex = alldex + 23;
					alliint = alliint + 11;
					allweight = allweight + 3705;
					break;
				case 26:
					allhp = allhp + 310;
					allmp = allmp + 78;
					allpv = allpv + 3;
					allstr = allstr + 12;
					alldex = alldex + 23;
					alliint = alliint + 11;
					allweight = allweight + 3750;
					break;
				case 27:
					allhp = allhp + 319;
					allmp = allmp + 79;
					allpv = allpv + 4;
					allstr = allstr + 12;
					alldex = alldex + 24;
					alliint = alliint + 11;
					allweight = allweight + 3765;
					break;
				case 28:
					allhp = allhp + 328;
					allmp = allmp + 80;
					allpv = allpv + 4;
					allstr = allstr + 12;
					alldex = alldex + 24;
					alliint = alliint + 11;
					allweight = allweight + 3780;
					break;
				case 29:
					allhp = allhp + 337;
					allmp = allmp + 81;
					allpv = allpv + 4;
					allstr = allstr + 12;
					alldex = alldex + 24;
					alliint = alliint + 11;
					allweight = allweight + 3795;
					break;
				case 30:
					allhp = allhp + 346;
					allmp = allmp + 84;
					allpv = allpv + 4;
					allstr = allstr + 12;
					alldex = alldex + 25;
					alliint = alliint + 12;
					allweight = allweight + 3810;
					break;
				case 31:
					allhp = allhp + 355;
					allmp = allmp + 85;
					allpv = allpv + 4;
					allstr = allstr + 12;
					alldex = alldex + 25;
					alliint = alliint + 12;
					allweight = allweight + 3825;
					break;
				case 32:
					allhp = allhp + 364;
					allmp = allmp + 86;
					allpv = allpv + 4;
					allstr = allstr + 12;
					alldex = alldex + 25;
					alliint = alliint + 12;
					allweight = allweight + 3840;
					break;
				case 33:
					allhp = allhp + 373;
					allmp = allmp + 87;
					allpv = allpv + 4;
					allstr = allstr + 12;
					alldex = alldex + 26;
					alliint = alliint + 12;
					allweight = allweight + 3855;
					break;
				case 34:
					allhp = allhp + 382;
					allmp = allmp + 88;
					allpv = allpv + 4;
					allstr = allstr + 12;
					alldex = alldex + 26;
					alliint = alliint + 12;
					allweight = allweight + 3870;
					break;
				case 35:
					allhp = allhp + 391;
					allmp = allmp + 89;
					allpv = allpv + 4;
					allstr = allstr + 12;
					alldex = alldex + 26;
					alliint = alliint + 12;
					allweight = allweight + 3885;
					break;
				case 36:
					allhp = allhp + 400;
					allmp = allmp + 90;
					allpv = allpv + 5;
					allstr = allstr + 12;
					alldex = alldex + 27;
					alliint = alliint + 12;
					allweight = allweight + 3900;
					break;
				case 37:
					allhp = allhp + 409;
					allmp = allmp + 91;
					allpv = allpv + 5;
					allstr = allstr + 12;
					alldex = alldex + 27;
					alliint = alliint + 12;
					allweight = allweight + 3915;
					break;
				case 38:
					allhp = allhp + 418;
					allmp = allmp + 92;
					allpv = allpv + 5;
					allstr = allstr + 12;
					alldex = alldex + 27;
					alliint = alliint + 12;
					allweight = allweight + 3930;
					break;
				case 39:
					allhp = allhp + 430;
					allmp = allmp + 93;
					allpv = allpv + 5;
					allstr = allstr + 13;
					alldex = alldex + 28;
					alliint = alliint + 12;
					allweight = allweight + 3975;
					break;
				case 40:
					allhp = allhp + 439;
					allmp = allmp + 94;
					allpv = allpv + 5;
					allstr = allstr + 13;
					alldex = alldex + 28;
					alliint = alliint + 12;
					allweight = allweight + 3990;
					break;
				case 41:
					allhp = allhp + 448;
					allmp = allmp + 95;
					allpv = allpv + 5;
					allstr = allstr + 13;
					alldex = alldex + 28;
					alliint = alliint + 12;
					allweight = allweight + 4005;
					break;
				case 42:
					allhp = allhp + 457;
					allmp = allmp + 96;
					allpv = allpv + 5;
					allstr = allstr + 13;
					alldex = alldex + 29;
					alliint = alliint + 12;
					allweight = allweight + 4020;
					break;
				case 43:
					allhp = allhp + 466;
					allmp = allmp + 97;
					allpv = allpv + 5;
					allstr = allstr + 13;
					alldex = alldex + 29;
					alliint = alliint + 12;
					allweight = allweight + 4035;
					break;
				case 44:
					allhp = allhp + 475;
					allmp = allmp + 98;
					allpv = allpv + 5;
					allstr = allstr + 13;
					alldex = alldex + 29;
					alliint = alliint + 12;
					allweight = allweight + 4050;
					break;
				case 45:
					allhp = allhp + 484;
					allmp = allmp + 101;
					allpv = allpv + 6;
					allstr = allstr + 13;
					alldex = alldex + 30;
					alliint = alliint + 13;
					allweight = allweight + 4065;
					break;
				case 46:
					allhp = allhp + 493;
					allmp = allmp + 102;
					allpv = allpv + 6;
					allstr = allstr + 13;
					alldex = alldex + 30;
					alliint = alliint + 13;
					allweight = allweight + 4080;
					break;
				case 47:
					allhp = allhp + 502;
					allmp = allmp + 103;
					allpv = allpv + 6;
					allstr = allstr + 13;
					alldex = alldex + 30;
					alliint = alliint + 13;
					allweight = allweight + 4095;
					break;
				case 48:
					allhp = allhp + 511;
					allmp = allmp + 104;
					allpv = allpv + 6;
					allstr = allstr + 13;
					alldex = alldex + 31;
					alliint = alliint + 13;
					allweight = allweight + 4110;
					break;
				case 49:
					allhp = allhp + 520;
					allmp = allmp + 105;
					allpv = allpv + 6;
					allstr = allstr + 13;
					alldex = alldex + 31;
					alliint = alliint + 13;
					allweight = allweight + 4125;
					break;
				case 50:
					allhp = allhp + 529;
					allmp = allmp + 106;
					allpv = allpv + 6;
					allstr = allstr + 13;
					alldex = alldex + 31;
					alliint = alliint + 13;
					allweight = allweight + 4140;
					break;
				case 51:
					allhp = allhp + 538;
					allmp = allmp + 107;
					allpv = allpv + 6;
					allstr = allstr + 13;
					alldex = alldex + 32;
					alliint = alliint + 13;
					allweight = allweight + 4155;
					break;
				case 52:
					allhp = allhp + 550;
					allmp = allmp + 108;
					allpv = allpv + 6;
					allstr = allstr + 14;
					alldex = alldex + 32;
					alliint = alliint + 13;
					allweight = allweight + 4200;
					break;
				case 53:
					allhp = allhp + 559;
					allmp = allmp + 109;
					allpv = allpv + 6;
					allstr = allstr + 14;
					alldex = alldex + 32;
					alliint = alliint + 13;
					allweight = allweight + 4215;
					break;
				case 54:
					allhp = allhp + 568;
					allmp = allmp + 110;
					allpv = allpv + 7;
					allstr = allstr + 14;
					alldex = alldex + 33;
					alliint = alliint + 13;
					allweight = allweight + 4230;
					break;
				case 55:
					allhp = allhp + 577;
					allmp = allmp + 111;
					allpv = allpv + 7;
					allstr = allstr + 14;
					alldex = alldex + 33;
					alliint = alliint + 13;
					allweight = allweight + 4245;
					break;
				case 56:
					allhp = allhp + 586;
					allmp = allmp + 112;
					allpv = allpv + 7;
					allstr = allstr + 14;
					alldex = alldex + 33;
					alliint = alliint + 13;
					allweight = allweight + 4260;
					break;
				case 57:
					allhp = allhp + 595;
					allmp = allmp + 113;
					allpv = allpv + 7;
					allstr = allstr + 14;
					alldex = alldex + 34;
					alliint = alliint + 13;
					allweight = allweight + 4275;
					break;
				case 58:
					allhp = allhp + 604;
					allmp = allmp + 114;
					allpv = allpv + 7;
					allstr = allstr + 14;
					alldex = alldex + 34;
					alliint = alliint + 13;
					allweight = allweight + 4290;
					break;
				case 59:
					allhp = allhp + 613;
					allmp = allmp + 115;
					allpv = allpv + 7;
					allstr = allstr + 14;
					alldex = alldex + 34;
					alliint = alliint + 13;
					allweight = allweight + 4305;
					break;
				case 60:
					allhp = allhp + 622;
					allmp = allmp + 118;
					allpv = allpv + 7;
					allstr = allstr + 14;
					alldex = alldex + 35;
					alliint = alliint + 14;
					allweight = allweight + 4320;
					break;
				case 61:
					allhp = allhp + 631;
					allmp = allmp + 119;
					allpv = allpv + 7;
					allstr = allstr + 14;
					alldex = alldex + 35;
					alliint = alliint + 14;
					allweight = allweight + 4335;
					break;
				case 62:
					allhp = allhp + 640;
					allmp = allmp + 120;
					allpv = allpv + 7;
					allstr = allstr + 14;
					alldex = alldex + 35;
					alliint = alliint + 14;
					allweight = allweight + 4350;
					break;
				case 63:
					allhp = allhp + 649;
					allmp = allmp + 121;
					allpv = allpv + 8;
					allstr = allstr + 14;
					alldex = alldex + 36;
					alliint = alliint + 14;
					allweight = allweight + 4365;
					break;
				case 64:
					allhp = allhp + 658;
					allmp = allmp + 122;
					allpv = allpv + 8;
					allstr = allstr + 14;
					alldex = alldex + 36;
					alliint = alliint + 14;
					allweight = allweight + 4380;
					break;
				case 65:
					allhp = allhp + 670;
					allmp = allmp + 123;
					allpv = allpv + 8;
					allstr = allstr + 15;
					alldex = alldex + 36;
					alliint = alliint + 14;
					allweight = allweight + 4425;
					break;
				case 66:
					allhp = allhp + 679;
					allmp = allmp + 124;
					allpv = allpv + 8;
					allstr = allstr + 15;
					alldex = alldex + 37;
					alliint = alliint + 14;
					allweight = allweight + 4440;
					break;
				case 67:
					allhp = allhp + 688;
					allmp = allmp + 125;
					allpv = allpv + 8;
					allstr = allstr + 15;
					alldex = alldex + 37;
					alliint = alliint + 14;
					allweight = allweight + 4455;
					break;
				case 68:
					allhp = allhp + 697;
					allmp = allmp + 126;
					allpv = allpv + 8;
					allstr = allstr + 15;
					alldex = alldex + 37;
					alliint = alliint + 14;
					allweight = allweight + 4470;
					break;
				case 69:
					allhp = allhp + 706;
					allmp = allmp + 127;
					allpv = allpv + 8;
					allstr = allstr + 15;
					alldex = alldex + 38;
					alliint = alliint + 14;
					allweight = allweight + 4485;
					break;
				case 70:
					allhp = allhp + 715;
					allmp = allmp + 128;
					allpv = allpv + 8;
					allstr = allstr + 15;
					alldex = alldex + 38;
					alliint = alliint + 14;
					allweight = allweight + 4500;
					break;
				case 71:
					allhp = allhp + 724;
					allmp = allmp + 129;
					allpv = allpv + 8;
					allstr = allstr + 15;
					alldex = alldex + 38;
					alliint = alliint + 14;
					allweight = allweight + 4515;
					break;
				case 72:
					allhp = allhp + 733;
					allmp = allmp + 130;
					allpv = allpv + 9;
					allstr = allstr + 15;
					alldex = alldex + 39;
					alliint = alliint + 14;
					allweight = allweight + 4530;
					break;
				case 73:
					allhp = allhp + 742;
					allmp = allmp + 131;
					allpv = allpv + 9;
					allstr = allstr + 15;
					alldex = alldex + 39;
					alliint = alliint + 14;
					allweight = allweight + 4545;
					break;
				case 74:
					allhp = allhp + 751;
					allmp = allmp + 132;
					allpv = allpv + 9;
					allstr = allstr + 15;
					alldex = alldex + 39;
					alliint = alliint + 14;
					allweight = allweight + 4560;
					break;
				case 75:
					allhp = allhp + 760;
					allmp = allmp + 135;
					allpv = allpv + 9;
					allstr = allstr + 15;
					alldex = alldex + 40;
					alliint = alliint + 15;
					allweight = allweight + 4575;
					break;
				case 76:
					allhp = allhp + 769;
					allmp = allmp + 136;
					allpv = allpv + 9;
					allstr = allstr + 15;
					alldex = alldex + 40;
					alliint = alliint + 15;
					allweight = allweight + 4590;
					break;
				case 77:
					allhp = allhp + 778;
					allmp = allmp + 137;
					allpv = allpv + 9;
					allstr = allstr + 15;
					alldex = alldex + 40;
					alliint = alliint + 15;
					allweight = allweight + 4605;
					break;
				case 78:
					allhp = allhp + 790;
					allmp = allmp + 138;
					allpv = allpv + 9;
					allstr = allstr + 16;
					alldex = alldex + 41;
					alliint = alliint + 15;
					allweight = allweight + 4650;
					break;
				case 79:
					allhp = allhp + 799;
					allmp = allmp + 139;
					allpv = allpv + 9;
					allstr = allstr + 16;
					alldex = alldex + 41;
					alliint = alliint + 15;
					allweight = allweight + 4665;
					break;
				case 80:
					allhp = allhp + 808;
					allmp = allmp + 140;
					allpv = allpv + 9;
					allstr = allstr + 16;
					alldex = alldex + 41;
					alliint = alliint + 15;
					allweight = allweight + 4680;
					break;
				case 81:
					allhp = allhp + 817;
					allmp = allmp + 141;
					allpv = allpv + 10;
					allstr = allstr + 16;
					alldex = alldex + 42;
					alliint = alliint + 15;
					allweight = allweight + 4695;
					break;
				case 82:
					allhp = allhp + 826;
					allmp = allmp + 142;
					allpv = allpv + 10;
					allstr = allstr + 16;
					alldex = alldex + 42;
					alliint = alliint + 15;
					allweight = allweight + 4710;
					break;
				case 83:
					allhp = allhp + 835;
					allmp = allmp + 143;
					allpv = allpv + 10;
					allstr = allstr + 16;
					alldex = alldex + 42;
					alliint = alliint + 15;
					allweight = allweight + 4725;
					break;
				case 84:
					allhp = allhp + 844;
					allmp = allmp + 144;
					allpv = allpv + 10;
					allstr = allstr + 16;
					alldex = alldex + 43;
					alliint = alliint + 15;
					allweight = allweight + 4740;
					break;
				case 85:
					allhp = allhp + 853;
					allmp = allmp + 145;
					allpv = allpv + 10;
					allstr = allstr + 16;
					alldex = alldex + 43;
					alliint = alliint + 15;
					allweight = allweight + 4755;
					break;
				case 86:
					allhp = allhp + 862;
					allmp = allmp + 146;
					allpv = allpv + 10;
					allstr = allstr + 16;
					alldex = alldex + 43;
					alliint = alliint + 15;
					allweight = allweight + 4770;
					break;
				case 87:
					allhp = allhp + 871;
					allmp = allmp + 147;
					allpv = allpv + 10;
					allstr = allstr + 16;
					alldex = alldex + 44;
					alliint = alliint + 15;
					allweight = allweight + 4785;
					break;
				case 88:
					allhp = allhp + 880;
					allmp = allmp + 148;
					allpv = allpv + 10;
					allstr = allstr + 16;
					alldex = alldex + 44;
					alliint = alliint + 15;
					allweight = allweight + 4800;
					break;
				case 89:
					allhp = allhp + 889;
					allmp = allmp + 149;
					allpv = allpv + 10;
					allstr = allstr + 16;
					alldex = alldex + 44;
					alliint = alliint + 15;
					allweight = allweight + 4815;
					break;
				case 90:
					allhp = allhp + 898;
					allmp = allmp + 152;
					allpv = allpv + 11;
					allstr = allstr + 16;
					alldex = alldex + 45;
					alliint = alliint + 16;
					allweight = allweight + 4830;
					break;
				case 91:
					allhp = allhp + 910;
					allmp = allmp + 153;
					allpv = allpv + 11;
					allstr = allstr + 17;
					alldex = alldex + 45;
					alliint = alliint + 16;
					allweight = allweight + 4875;
					break;
				case 92:
					allhp = allhp + 919;
					allmp = allmp + 154;
					allpv = allpv + 11;
					allstr = allstr + 17;
					alldex = alldex + 45;
					alliint = alliint + 16;
					allweight = allweight + 4890;
					break;
				case 93:
					allhp = allhp + 928;
					allmp = allmp + 155;
					allpv = allpv + 11;
					allstr = allstr + 17;
					alldex = alldex + 46;
					alliint = alliint + 16;
					allweight = allweight + 4905;
					break;
				case 94:
					allhp = allhp + 937;
					allmp = allmp + 156;
					allpv = allpv + 11;
					allstr = allstr + 17;
					alldex = alldex + 46;
					alliint = alliint + 16;
					allweight = allweight + 4920;
					break;
				case 95:
					allhp = allhp + 946;
					allmp = allmp + 157;
					allpv = allpv + 11;
					allstr = allstr + 17;
					alldex = alldex + 46;
					alliint = alliint + 16;
					allweight = allweight + 4935;
					break;
				case 96:
					allhp = allhp + 955;
					allmp = allmp + 158;
					allpv = allpv + 11;
					allstr = allstr + 17;
					alldex = alldex + 47;
					alliint = alliint + 16;
					allweight = allweight + 4950;
					break;
				case 97:
					allhp = allhp + 964;
					allmp = allmp + 159;
					allpv = allpv + 11;
					allstr = allstr + 17;
					alldex = alldex + 47;
					alliint = alliint + 16;
					allweight = allweight + 4965;
					break;
				case 98:
					allhp = allhp + 973;
					allmp = allmp + 160;
					allpv = allpv + 11;
					allstr = allstr + 17;
					alldex = alldex + 47;
					alliint = alliint + 16;
					allweight = allweight + 4980;
					break;
				case 99:
					allhp = allhp + 982;
					allmp = allmp + 161;
					allpv = allpv + 12;
					allstr = allstr + 17;
					alldex = alldex + 48;
					alliint = alliint + 16;
					allweight = allweight + 4995;
					break;
				case 100:
					allhp = allhp + 991;
					allmp = allmp + 162;
					allpv = allpv + 12;
					allstr = allstr + 17;
					alldex = alldex + 48;
					alliint = alliint + 16;
					allweight = allweight + 5010;
					break;
				case 101:
					allhp = allhp + 1000;
					allmp = allmp + 173;
					allpv = allpv + 12;
					allstr = allstr + 17;
					alldex = alldex + 48;
					alliint = alliint + 16;
					allweight = allweight + 5425;
					break;
				case 102:
					allhp = allhp + 1009;
					allmp = allmp + 184;
					allpv = allpv + 12;
					allstr = allstr + 17;
					alldex = alldex + 49;
					alliint = alliint + 16;
					allweight = allweight + 5840;
					break;
				case 103:
					allhp = allhp + 1018;
					allmp = allmp + 195;
					allpv = allpv + 12;
					allstr = allstr + 17;
					alldex = alldex + 49;
					alliint = alliint + 16;
					allweight = allweight + 6255;
					break;
				case 104:
					allhp = allhp + 1030;
					allmp = allmp + 206;
					allpv = allpv + 12;
					allstr = allstr + 18;
					alldex = alldex + 49;
					alliint = alliint + 16;
					allweight = allweight + 6700;
					break;
				case 105:
					allhp = allhp + 1039;
					allmp = allmp + 219;
					allpv = allpv + 12;
					allstr = allstr + 18;
					alldex = alldex + 50;
					alliint = alliint + 17;
					allweight = allweight + 7115;
					break;
				case 106:
					allhp = allhp + 1048;
					allmp = allmp + 230;
					allpv = allpv + 12;
					allstr = allstr + 18;
					alldex = alldex + 50;
					alliint = alliint + 17;
					allweight = allweight + 7530;
					break;
				case 107:
					allhp = allhp + 1057;
					allmp = allmp + 241;
					allpv = allpv + 12;
					allstr = allstr + 18;
					alldex = alldex + 50;
					alliint = alliint + 17;
					allweight = allweight + 7945;
					break;
				case 108:
					allhp = allhp + 1066;
					allmp = allmp + 252;
					allpv = allpv + 13;
					allstr = allstr + 18;
					alldex = alldex + 51;
					alliint = alliint + 17;
					allweight = allweight + 8360;
					break;
				case 109:
					allhp = allhp + 1075;
					allmp = allmp + 263;
					allpv = allpv + 13;
					allstr = allstr + 18;
					alldex = alldex + 51;
					alliint = alliint + 17;
					allweight = allweight + 8775;
					break;
				case 110:
					allhp = allhp + 1084;
					allmp = allmp + 274;
					allpv = allpv + 13;
					allstr = allstr + 18;
					alldex = alldex + 51;
					alliint = alliint + 17;
					allweight = allweight + 9190;
					break;
				case 111:
					allhp = allhp + 1093;
					allmp = allmp + 285;
					allpv = allpv + 13;
					allstr = allstr + 18;
					alldex = alldex + 52;
					alliint = alliint + 17;
					allweight = allweight + 9605;
					break;
				case 112:
					allhp = allhp + 1102;
					allmp = allmp + 296;
					allpv = allpv + 13;
					allstr = allstr + 18;
					alldex = alldex + 52;
					alliint = alliint + 17;
					allweight = allweight + 10020;
					break;
				case 113:
					allhp = allhp + 1111;
					allmp = allmp + 307;
					allpv = allpv + 13;
					allstr = allstr + 18;
					alldex = alldex + 52;
					alliint = alliint + 17;
					allweight = allweight + 10435;
					break;
				case 114:
					allhp = allhp + 1120;
					allmp = allmp + 318;
					allpv = allpv + 13;
					allstr = allstr + 18;
					alldex = alldex + 53;
					alliint = alliint + 17;
					allweight = allweight + 10850;
					break;
				case 115:
					allhp = allhp + 1129;
					allmp = allmp + 329;
					allpv = allpv + 13;
					allstr = allstr + 18;
					alldex = alldex + 53;
					alliint = alliint + 17;
					allweight = allweight + 11265;
					break;
				case 116:
					allhp = allhp + 1138;
					allmp = allmp + 340;
					allpv = allpv + 13;
					allstr = allstr + 18;
					alldex = alldex + 53;
					alliint = alliint + 17;
					allweight = allweight + 11680;
					break;
				case 117:
					allhp = allhp + 1150;
					allmp = allmp + 351;
					allpv = allpv + 14;
					allstr = allstr + 19;
					alldex = alldex + 54;
					alliint = alliint + 17;
					allweight = allweight + 12125;
					break;
				case 118:
					allhp = allhp + 1159;
					allmp = allmp + 362;
					allpv = allpv + 14;
					allstr = allstr + 19;
					alldex = alldex + 54;
					alliint = alliint + 17;
					allweight = allweight + 12540;
					break;
				case 119:
					allhp = allhp + 1168;
					allmp = allmp + 373;
					allpv = allpv + 14;
					allstr = allstr + 19;
					alldex = alldex + 54;
					alliint = alliint + 17;
					allweight = allweight + 12955;
					break;
				case 120:
					allhp = allhp + 1177;
					allmp = allmp + 386;
					allpv = allpv + 14;
					allstr = allstr + 19;
					alldex = alldex + 55;
					alliint = alliint + 18;
					allweight = allweight + 13370;
					break;
				case 121:
					allhp = allhp + 1186;
					allmp = allmp + 397;
					allpv = allpv + 14;
					allstr = allstr + 19;
					alldex = alldex + 55;
					alliint = alliint + 18;
					allweight = allweight + 13785;
					break;
				case 122:
					allhp = allhp + 1195;
					allmp = allmp + 408;
					allpv = allpv + 14;
					allstr = allstr + 19;
					alldex = alldex + 55;
					alliint = alliint + 18;
					allweight = allweight + 14200;
					break;
				case 123:
					allhp = allhp + 1204;
					allmp = allmp + 419;
					allpv = allpv + 14;
					allstr = allstr + 19;
					alldex = alldex + 56;
					alliint = alliint + 18;
					allweight = allweight + 14615;
					break;
				case 124:
					allhp = allhp + 1213;
					allmp = allmp + 430;
					allpv = allpv + 14;
					allstr = allstr + 19;
					alldex = alldex + 56;
					alliint = alliint + 18;
					allweight = allweight + 15030;
					break;
				case 125:
					allhp = allhp + 1222;
					allmp = allmp + 441;
					allpv = allpv + 14;
					allstr = allstr + 19;
					alldex = alldex + 56;
					alliint = alliint + 18;
					allweight = allweight + 15445;
					break;
				case 126:
					allhp = allhp + 1231;
					allmp = allmp + 452;
					allpv = allpv + 15;
					allstr = allstr + 19;
					alldex = alldex + 57;
					alliint = alliint + 18;
					allweight = allweight + 15860;
					break;
				case 127:
					allhp = allhp + 1240;
					allmp = allmp + 463;
					allpv = allpv + 15;
					allstr = allstr + 19;
					alldex = alldex + 57;
					alliint = alliint + 18;
					allweight = allweight + 16275;
					break;
				case 128:
					allhp = allhp + 1249;
					allmp = allmp + 474;
					allpv = allpv + 15;
					allstr = allstr + 19;
					alldex = alldex + 57;
					alliint = alliint + 18;
					allweight = allweight + 16690;
					break;
				case 129:
					allhp = allhp + 1258;
					allmp = allmp + 485;
					allpv = allpv + 15;
					allstr = allstr + 19;
					alldex = alldex + 58;
					alliint = alliint + 18;
					allweight = allweight + 17105;
					break;
				case 130:
					allhp = allhp + 1270;
					allmp = allmp + 496;
					allpv = allpv + 15;
					allstr = allstr + 20;
					alldex = alldex + 58;
					alliint = alliint + 18;
					allweight = allweight + 17550;
					break;
				case 131:
					allhp = allhp + 1279;
					allmp = allmp + 507;
					allpv = allpv + 15;
					allstr = allstr + 20;
					alldex = alldex + 58;
					alliint = alliint + 18;
					allweight = allweight + 17965;
					break;
				case 132:
					allhp = allhp + 1288;
					allmp = allmp + 518;
					allpv = allpv + 15;
					allstr = allstr + 20;
					alldex = alldex + 59;
					alliint = alliint + 18;
					allweight = allweight + 18380;
					break;
				case 133:
					allhp = allhp + 1297;
					allmp = allmp + 529;
					allpv = allpv + 15;
					allstr = allstr + 20;
					alldex = alldex + 59;
					alliint = alliint + 18;
					allweight = allweight + 18795;
					break;
				case 134:
					allhp = allhp + 1306;
					allmp = allmp + 540;
					allpv = allpv + 15;
					allstr = allstr + 20;
					alldex = alldex + 59;
					alliint = alliint + 18;
					allweight = allweight + 19210;
					break;
				case 135:
					allhp = allhp + 1315;
					allmp = allmp + 553;
					allpv = allpv + 16;
					allstr = allstr + 20;
					alldex = alldex + 60;
					alliint = alliint + 19;
					allweight = allweight + 19625;
					break;
				case 136:
					allhp = allhp + 1324;
					allmp = allmp + 564;
					allpv = allpv + 16;
					allstr = allstr + 20;
					alldex = alldex + 60;
					alliint = alliint + 19;
					allweight = allweight + 20040;
					break;
				case 137:
					allhp = allhp + 1333;
					allmp = allmp + 575;
					allpv = allpv + 16;
					allstr = allstr + 20;
					alldex = alldex + 60;
					alliint = alliint + 19;
					allweight = allweight + 20455;
					break;
				case 138:
					allhp = allhp + 1342;
					allmp = allmp + 586;
					allpv = allpv + 16;
					allstr = allstr + 20;
					alldex = alldex + 61;
					alliint = alliint + 19;
					allweight = allweight + 20870;
					break;
				case 139:
					allhp = allhp + 1351;
					allmp = allmp + 597;
					allpv = allpv + 16;
					allstr = allstr + 20;
					alldex = alldex + 61;
					alliint = alliint + 19;
					allweight = allweight + 21285;
					break;
				case 140:
					allhp = allhp + 1360;
					allmp = allmp + 608;
					allpv = allpv + 16;
					allstr = allstr + 20;
					alldex = alldex + 61;
					alliint = alliint + 19;
					allweight = allweight + 21700;
					break;
				case 141:
					allhp = allhp + 1369;
					allmp = allmp + 619;
					allpv = allpv + 16;
					allstr = allstr + 20;
					alldex = alldex + 62;
					alliint = alliint + 19;
					allweight = allweight + 22115;
					break;
				case 142:
					allhp = allhp + 1378;
					allmp = allmp + 630;
					allpv = allpv + 16;
					allstr = allstr + 20;
					alldex = alldex + 62;
					alliint = alliint + 19;
					allweight = allweight + 22530;
					break;
				case 143:
					allhp = allhp + 1390;
					allmp = allmp + 641;
					allpv = allpv + 16;
					allstr = allstr + 21;
					alldex = alldex + 62;
					alliint = alliint + 19;
					allweight = allweight + 22975;
					break;
				case 144:
					allhp = allhp + 1399;
					allmp = allmp + 652;
					allpv = allpv + 17;
					allstr = allstr + 21;
					alldex = alldex + 63;
					alliint = alliint + 19;
					allweight = allweight + 23390;
					break;
				case 145:
					allhp = allhp + 1408;
					allmp = allmp + 663;
					allpv = allpv + 17;
					allstr = allstr + 21;
					alldex = alldex + 63;
					alliint = alliint + 19;
					allweight = allweight + 23805;
					break;
				case 146:
					allhp = allhp + 1417;
					allmp = allmp + 674;
					allpv = allpv + 17;
					allstr = allstr + 21;
					alldex = alldex + 63;
					alliint = alliint + 19;
					allweight = allweight + 24220;
					break;
				case 147:
					allhp = allhp + 1426;
					allmp = allmp + 685;
					allpv = allpv + 17;
					allstr = allstr + 21;
					alldex = alldex + 64;
					alliint = alliint + 19;
					allweight = allweight + 24635;
					break;
				case 148:
					allhp = allhp + 1435;
					allmp = allmp + 696;
					allpv = allpv + 17;
					allstr = allstr + 21;
					alldex = alldex + 64;
					alliint = alliint + 19;
					allweight = allweight + 25050;
					break;
				case 149:
					allhp = allhp + 1444;
					allmp = allmp + 707;
					allpv = allpv + 17;
					allstr = allstr + 21;
					alldex = alldex + 64;
					alliint = alliint + 19;
					allweight = allweight + 25465;
					break;
				case 150:
					allhp = allhp + 1453;
					allmp = allmp + 720;
					allpv = allpv + 17;
					allstr = allstr + 21;
					alldex = alldex + 65;
					alliint = alliint + 20;
					allweight = allweight + 25880;
					break;
				case 151:
					allhp = allhp + 1462;
					allmp = allmp + 731;
					allpv = allpv + 17;
					allstr = allstr + 21;
					alldex = alldex + 65;
					alliint = alliint + 20;
					allweight = allweight + 26295;
					break;
				case 152:
					allhp = allhp + 1471;
					allmp = allmp + 742;
					allpv = allpv + 17;
					allstr = allstr + 21;
					alldex = alldex + 65;
					alliint = alliint + 20;
					allweight = allweight + 26710;
					break;
				case 153:
					allhp = allhp + 1480;
					allmp = allmp + 753;
					allpv = allpv + 18;
					allstr = allstr + 21;
					alldex = alldex + 66;
					alliint = alliint + 20;
					allweight = allweight + 27125;
					break;
				case 154:
					allhp = allhp + 1489;
					allmp = allmp + 764;
					allpv = allpv + 18;
					allstr = allstr + 21;
					alldex = alldex + 66;
					alliint = alliint + 20;
					allweight = allweight + 27540;
					break;
				case 155:
					allhp = allhp + 1498;
					allmp = allmp + 775;
					allpv = allpv + 18;
					allstr = allstr + 21;
					alldex = alldex + 66;
					alliint = alliint + 20;
					allweight = allweight + 27955;
					break;
				case 156:
					allhp = allhp + 1510;
					allmp = allmp + 786;
					allpv = allpv + 18;
					allstr = allstr + 22;
					alldex = alldex + 67;
					alliint = alliint + 20;
					allweight = allweight + 28400;
					break;
				case 157:
					allhp = allhp + 1519;
					allmp = allmp + 797;
					allpv = allpv + 18;
					allstr = allstr + 22;
					alldex = alldex + 67;
					alliint = alliint + 20;
					allweight = allweight + 28815;
					break;
				case 158:
					allhp = allhp + 1528;
					allmp = allmp + 808;
					allpv = allpv + 18;
					allstr = allstr + 22;
					alldex = alldex + 67;
					alliint = alliint + 20;
					allweight = allweight + 29230;
					break;
				case 159:
					allhp = allhp + 1537;
					allmp = allmp + 819;
					allpv = allpv + 18;
					allstr = allstr + 22;
					alldex = alldex + 68;
					alliint = alliint + 20;
					allweight = allweight + 29645;
					break;
				case 160:
					allhp = allhp + 1546;
					allmp = allmp + 830;
					allpv = allpv + 18;
					allstr = allstr + 22;
					alldex = alldex + 68;
					alliint = alliint + 20;
					allweight = allweight + 30060;
					break;
				case 161:
					allhp = allhp + 1555;
					allmp = allmp + 841;
					allpv = allpv + 18;
					allstr = allstr + 22;
					alldex = alldex + 68;
					alliint = alliint + 20;
					allweight = allweight + 30475;
					break;
				case 162:
					allhp = allhp + 1564;
					allmp = allmp + 852;
					allpv = allpv + 19;
					allstr = allstr + 22;
					alldex = alldex + 69;
					alliint = alliint + 20;
					allweight = allweight + 30890;
					break;
				case 163:
					allhp = allhp + 1573;
					allmp = allmp + 863;
					allpv = allpv + 19;
					allstr = allstr + 22;
					alldex = alldex + 69;
					alliint = alliint + 20;
					allweight = allweight + 31305;
					break;
				case 164:
					allhp = allhp + 1582;
					allmp = allmp + 874;
					allpv = allpv + 19;
					allstr = allstr + 22;
					alldex = alldex + 69;
					alliint = alliint + 20;
					allweight = allweight + 31720;
					break;
				case 165:
					allhp = allhp + 1591;
					allmp = allmp + 887;
					allpv = allpv + 19;
					allstr = allstr + 22;
					alldex = alldex + 70;
					alliint = alliint + 21;
					allweight = allweight + 32135;
					break;
				case 166:
					allhp = allhp + 1600;
					allmp = allmp + 898;
					allpv = allpv + 19;
					allstr = allstr + 22;
					alldex = alldex + 70;
					alliint = alliint + 21;
					allweight = allweight + 32550;
					break;
				case 167:
					allhp = allhp + 1609;
					allmp = allmp + 909;
					allpv = allpv + 19;
					allstr = allstr + 22;
					alldex = alldex + 70;
					alliint = alliint + 21;
					allweight = allweight + 32965;
					break;
				case 168:
					allhp = allhp + 1618;
					allmp = allmp + 920;
					allpv = allpv + 19;
					allstr = allstr + 22;
					alldex = alldex + 71;
					alliint = alliint + 21;
					allweight = allweight + 33380;
					break;
				case 169:
					allhp = allhp + 1630;
					allmp = allmp + 931;
					allpv = allpv + 19;
					allstr = allstr + 23;
					alldex = alldex + 71;
					alliint = alliint + 21;
					allweight = allweight + 33825;
					break;
				case 170:
					allhp = allhp + 1639;
					allmp = allmp + 942;
					allpv = allpv + 19;
					allstr = allstr + 23;
					alldex = alldex + 71;
					alliint = alliint + 21;
					allweight = allweight + 34240;
					break;
				case 171:
					allhp = allhp + 1648;
					allmp = allmp + 953;
					allpv = allpv + 20;
					allstr = allstr + 23;
					alldex = alldex + 72;
					alliint = alliint + 21;
					allweight = allweight + 34655;
					break;
				case 172:
					allhp = allhp + 1657;
					allmp = allmp + 964;
					allpv = allpv + 20;
					allstr = allstr + 23;
					alldex = alldex + 72;
					alliint = alliint + 21;
					allweight = allweight + 35070;
					break;
				case 173:
					allhp = allhp + 1666;
					allmp = allmp + 975;
					allpv = allpv + 20;
					allstr = allstr + 23;
					alldex = alldex + 72;
					alliint = alliint + 21;
					allweight = allweight + 35485;
					break;
				case 174:
					allhp = allhp + 1675;
					allmp = allmp + 986;
					allpv = allpv + 20;
					allstr = allstr + 23;
					alldex = alldex + 73;
					alliint = alliint + 21;
					allweight = allweight + 35900;
					break;
				case 175:
					allhp = allhp + 1684;
					allmp = allmp + 997;
					allpv = allpv + 20;
					allstr = allstr + 23;
					alldex = alldex + 73;
					alliint = alliint + 21;
					allweight = allweight + 36315;
					break;
				case 176:
					allhp = allhp + 1693;
					allmp = allmp + 1008;
					allpv = allpv + 20;
					allstr = allstr + 23;
					alldex = alldex + 73;
					alliint = alliint + 21;
					allweight = allweight + 36730;
					break;
				case 177:
					allhp = allhp + 1702;
					allmp = allmp + 1019;
					allpv = allpv + 20;
					allstr = allstr + 23;
					alldex = alldex + 74;
					alliint = alliint + 21;
					allweight = allweight + 37145;
					break;
				case 178:
					allhp = allhp + 1711;
					allmp = allmp + 1030;
					allpv = allpv + 20;
					allstr = allstr + 23;
					alldex = alldex + 74;
					alliint = alliint + 21;
					allweight = allweight + 37560;
					break;
				case 179:
					allhp = allhp + 1720;
					allmp = allmp + 1041;
					allpv = allpv + 20;
					allstr = allstr + 23;
					alldex = alldex + 74;
					alliint = alliint + 21;
					allweight = allweight + 37975;
					break;
				case 180:
					allhp = allhp + 1729;
					allmp = allmp + 1054;
					allpv = allpv + 21;
					allstr = allstr + 23;
					alldex = alldex + 75;
					alliint = alliint + 22;
					allweight = allweight + 38390;
					break;
				case 181:
					allhp = allhp + 1738;
					allmp = allmp + 1065;
					allpv = allpv + 21;
					allstr = allstr + 23;
					alldex = alldex + 75;
					alliint = alliint + 22;
					allweight = allweight + 38805;
					break;
				case 182:
					allhp = allhp + 1750;
					allmp = allmp + 1076;
					allpv = allpv + 21;
					allstr = allstr + 24;
					alldex = alldex + 75;
					alliint = alliint + 22;
					allweight = allweight + 39250;
					break;
				case 183:
					allhp = allhp + 1759;
					allmp = allmp + 1087;
					allpv = allpv + 21;
					allstr = allstr + 24;
					alldex = alldex + 76;
					alliint = alliint + 22;
					allweight = allweight + 39665;
					break;
				case 184:
					allhp = allhp + 1768;
					allmp = allmp + 1098;
					allpv = allpv + 21;
					allstr = allstr + 24;
					alldex = alldex + 76;
					alliint = alliint + 22;
					allweight = allweight + 40080;
					break;
				case 185:
					allhp = allhp + 1777;
					allmp = allmp + 1109;
					allpv = allpv + 21;
					allstr = allstr + 24;
					alldex = alldex + 76;
					alliint = alliint + 22;
					allweight = allweight + 40495;
					break;
				case 186:
					allhp = allhp + 1786;
					allmp = allmp + 1120;
					allpv = allpv + 21;
					allstr = allstr + 24;
					alldex = alldex + 77;
					alliint = alliint + 22;
					allweight = allweight + 40910;
					break;
				case 187:
					allhp = allhp + 1795;
					allmp = allmp + 1131;
					allpv = allpv + 21;
					allstr = allstr + 24;
					alldex = alldex + 77;
					alliint = alliint + 22;
					allweight = allweight + 41325;
					break;
				case 188:
					allhp = allhp + 1804;
					allmp = allmp + 1142;
					allpv = allpv + 21;
					allstr = allstr + 24;
					alldex = alldex + 77;
					alliint = alliint + 22;
					allweight = allweight + 41740;
					break;
				case 189:
					allhp = allhp + 1813;
					allmp = allmp + 1153;
					allpv = allpv + 22;
					allstr = allstr + 24;
					alldex = alldex + 78;
					alliint = alliint + 22;
					allweight = allweight + 42155;
					break;
				case 190:
					allhp = allhp + 1822;
					allmp = allmp + 1164;
					allpv = allpv + 22;
					allstr = allstr + 24;
					alldex = alldex + 78;
					alliint = alliint + 22;
					allweight = allweight + 42570;
					break;
				case 191:
					allhp = allhp + 1831;
					allmp = allmp + 1175;
					allpv = allpv + 22;
					allstr = allstr + 24;
					alldex = alldex + 78;
					alliint = alliint + 22;
					allweight = allweight + 42985;
					break;
				case 192:
					allhp = allhp + 1840;
					allmp = allmp + 1186;
					allpv = allpv + 22;
					allstr = allstr + 24;
					alldex = alldex + 79;
					alliint = alliint + 22;
					allweight = allweight + 43400;
					break;
				case 193:
					allhp = allhp + 1849;
					allmp = allmp + 1197;
					allpv = allpv + 22;
					allstr = allstr + 24;
					alldex = alldex + 79;
					alliint = alliint + 22;
					allweight = allweight + 43815;
					break;
				case 194:
					allhp = allhp + 1858;
					allmp = allmp + 1208;
					allpv = allpv + 22;
					allstr = allstr + 24;
					alldex = alldex + 79;
					alliint = alliint + 22;
					allweight = allweight + 44230;
					break;
				case 195:
					allhp = allhp + 1870;
					allmp = allmp + 1221;
					allpv = allpv + 22;
					allstr = allstr + 25;
					alldex = alldex + 80;
					alliint = alliint + 23;
					allweight = allweight + 44675;
					break;
				case 196:
					allhp = allhp + 1879;
					allmp = allmp + 1232;
					allpv = allpv + 22;
					allstr = allstr + 25;
					alldex = alldex + 80;
					alliint = alliint + 23;
					allweight = allweight + 45090;
					break;
				case 197:
					allhp = allhp + 1888;
					allmp = allmp + 1243;
					allpv = allpv + 22;
					allstr = allstr + 25;
					alldex = alldex + 80;
					alliint = alliint + 23;
					allweight = allweight + 45505;
					break;
				case 198:
					allhp = allhp + 1897;
					allmp = allmp + 1254;
					allpv = allpv + 23;
					allstr = allstr + 25;
					alldex = alldex + 81;
					alliint = alliint + 23;
					allweight = allweight + 45920;
					break;
				case 199:
					allhp = allhp + 1906;
					allmp = allmp + 1265;
					allpv = allpv + 23;
					allstr = allstr + 25;
					alldex = alldex + 81;
					alliint = alliint + 23;
					allweight = allweight + 46335;
					break;
				case 200:
					allhp = allhp + 1915;
					allmp = allmp + 1276;
					allpv = allpv + 23;
					allstr = allstr + 25;
					alldex = alldex + 81;
					alliint = alliint + 23;
					allweight = allweight + 46750;
					break;
				case 201:
					allhp = allhp + 1924;
					allmp = allmp + 1287;
					allpv = allpv + 23;
					allstr = allstr + 25;
					alldex = alldex + 82;
					alliint = alliint + 23;
					allweight = allweight + 47165;
					break;
				case 202:
					allhp = allhp + 1933;
					allmp = allmp + 1298;
					allpv = allpv + 23;
					allstr = allstr + 25;
					alldex = alldex + 82;
					alliint = alliint + 23;
					allweight = allweight + 47580;
					break;
				case 203:
					allhp = allhp + 1942;
					allmp = allmp + 1309;
					allpv = allpv + 23;
					allstr = allstr + 25;
					alldex = alldex + 82;
					alliint = alliint + 23;
					allweight = allweight + 47995;
					break;
				case 204:
					allhp = allhp + 1951;
					allmp = allmp + 1320;
					allpv = allpv + 23;
					allstr = allstr + 25;
					alldex = alldex + 83;
					alliint = alliint + 23;
					allweight = allweight + 48410;
					break;
				case 205:
					allhp = allhp + 1960;
					allmp = allmp + 1331;
					allpv = allpv + 23;
					allstr = allstr + 25;
					alldex = alldex + 83;
					alliint = alliint + 23;
					allweight = allweight + 48825;
					break;
				case 206:
					allhp = allhp + 1969;
					allmp = allmp + 1342;
					allpv = allpv + 23;
					allstr = allstr + 25;
					alldex = alldex + 83;
					alliint = alliint + 23;
					allweight = allweight + 49240;
					break;
				case 207:
					allhp = allhp + 1978;
					allmp = allmp + 1353;
					allpv = allpv + 24;
					allstr = allstr + 25;
					alldex = alldex + 84;
					alliint = alliint + 23;
					allweight = allweight + 49655;
					break;
				case 208:
					allhp = allhp + 1990;
					allmp = allmp + 1364;
					allpv = allpv + 24;
					allstr = allstr + 26;
					alldex = alldex + 84;
					alliint = alliint + 23;
					allweight = allweight + 50100;
					break;
				case 209:
					allhp = allhp + 1999;
					allmp = allmp + 1375;
					allpv = allpv + 24;
					allstr = allstr + 26;
					alldex = alldex + 84;
					alliint = alliint + 23;
					allweight = allweight + 50515;
					break;
				case 210:
					allhp = allhp + 2008;
					allmp = allmp + 1388;
					allpv = allpv + 24;
					allstr = allstr + 26;
					alldex = alldex + 85;
					alliint = alliint + 24;
					allweight = allweight + 50930;
					break;
				case 211:
					allhp = allhp + 2017;
					allmp = allmp + 1399;
					allpv = allpv + 24;
					allstr = allstr + 26;
					alldex = alldex + 85;
					alliint = alliint + 24;
					allweight = allweight + 51345;
					break;
				case 212:
					allhp = allhp + 2026;
					allmp = allmp + 1410;
					allpv = allpv + 24;
					allstr = allstr + 26;
					alldex = alldex + 85;
					alliint = alliint + 24;
					allweight = allweight + 51760;
					break;
				case 213:
					allhp = allhp + 2035;
					allmp = allmp + 1421;
					allpv = allpv + 24;
					allstr = allstr + 26;
					alldex = alldex + 86;
					alliint = alliint + 24;
					allweight = allweight + 52175;
					break;
				case 214:
					allhp = allhp + 2044;
					allmp = allmp + 1432;
					allpv = allpv + 24;
					allstr = allstr + 26;
					alldex = alldex + 86;
					alliint = alliint + 24;
					allweight = allweight + 52590;
					break;
				case 215:
					allhp = allhp + 2053;
					allmp = allmp + 1443;
					allpv = allpv + 24;
					allstr = allstr + 26;
					alldex = alldex + 86;
					alliint = alliint + 24;
					allweight = allweight + 53005;
					break;
				case 216:
					allhp = allhp + 2062;
					allmp = allmp + 1454;
					allpv = allpv + 25;
					allstr = allstr + 26;
					alldex = alldex + 87;
					alliint = alliint + 24;
					allweight = allweight + 53420;
					break;
				case 217:
					allhp = allhp + 2071;
					allmp = allmp + 1465;
					allpv = allpv + 25;
					allstr = allstr + 26;
					alldex = alldex + 87;
					alliint = alliint + 24;
					allweight = allweight + 53835;
					break;
				case 218:
					allhp = allhp + 2080;
					allmp = allmp + 1476;
					allpv = allpv + 25;
					allstr = allstr + 26;
					alldex = alldex + 87;
					alliint = alliint + 24;
					allweight = allweight + 54250;
					break;
				case 219:
					allhp = allhp + 2089;
					allmp = allmp + 1487;
					allpv = allpv + 25;
					allstr = allstr + 26;
					alldex = alldex + 88;
					alliint = alliint + 24;
					allweight = allweight + 54665;
					break;
				case 220:
					allhp = allhp + 2098;
					allmp = allmp + 1498;
					allpv = allpv + 25;
					allstr = allstr + 26;
					alldex = alldex + 88;
					alliint = alliint + 24;
					allweight = allweight + 55080;
					break;
				case 221:
					allhp = allhp + 2110;
					allmp = allmp + 1509;
					allpv = allpv + 25;
					allstr = allstr + 27;
					alldex = alldex + 88;
					alliint = alliint + 24;
					allweight = allweight + 55525;
					break;
				case 222:
					allhp = allhp + 2119;
					allmp = allmp + 1520;
					allpv = allpv + 25;
					allstr = allstr + 27;
					alldex = alldex + 89;
					alliint = alliint + 24;
					allweight = allweight + 55940;
					break;
				case 223:
					allhp = allhp + 2128;
					allmp = allmp + 1531;
					allpv = allpv + 25;
					allstr = allstr + 27;
					alldex = alldex + 89;
					alliint = alliint + 24;
					allweight = allweight + 56355;
					break;
				case 224:
					allhp = allhp + 2137;
					allmp = allmp + 1542;
					allpv = allpv + 25;
					allstr = allstr + 27;
					alldex = alldex + 89;
					alliint = alliint + 24;
					allweight = allweight + 56770;
					break;
				case 225:
					allhp = allhp + 2146;
					allmp = allmp + 1555;
					allpv = allpv + 26;
					allstr = allstr + 27;
					alldex = alldex + 90;
					alliint = alliint + 25;
					allweight = allweight + 57185;
					break;
				case 226:
					allhp = allhp + 2155;
					allmp = allmp + 1566;
					allpv = allpv + 26;
					allstr = allstr + 27;
					alldex = alldex + 90;
					alliint = alliint + 25;
					allweight = allweight + 57600;
					break;
				case 227:
					allhp = allhp + 2164;
					allmp = allmp + 1577;
					allpv = allpv + 26;
					allstr = allstr + 27;
					alldex = alldex + 90;
					alliint = alliint + 25;
					allweight = allweight + 58015;
					break;
				case 228:
					allhp = allhp + 2173;
					allmp = allmp + 1588;
					allpv = allpv + 26;
					allstr = allstr + 27;
					alldex = alldex + 91;
					alliint = alliint + 25;
					allweight = allweight + 58430;
					break;
				case 229:
					allhp = allhp + 2182;
					allmp = allmp + 1599;
					allpv = allpv + 26;
					allstr = allstr + 27;
					alldex = alldex + 91;
					alliint = alliint + 25;
					allweight = allweight + 58845;
					break;
				case 230:
					allhp = allhp + 2191;
					allmp = allmp + 1610;
					allpv = allpv + 26;
					allstr = allstr + 27;
					alldex = alldex + 91;
					alliint = alliint + 25;
					allweight = allweight + 59260;
					break;
				case 231:
					allhp = allhp + 2200;
					allmp = allmp + 1621;
					allpv = allpv + 26;
					allstr = allstr + 27;
					alldex = alldex + 92;
					alliint = alliint + 25;
					allweight = allweight + 59675;
					break;
				case 232:
					allhp = allhp + 2209;
					allmp = allmp + 1632;
					allpv = allpv + 26;
					allstr = allstr + 27;
					alldex = alldex + 92;
					alliint = alliint + 25;
					allweight = allweight + 60090;
					break;
				case 233:
					allhp = allhp + 2218;
					allmp = allmp + 1643;
					allpv = allpv + 26;
					allstr = allstr + 27;
					alldex = alldex + 92;
					alliint = alliint + 25;
					allweight = allweight + 60505;
					break;
				case 234:
					allhp = allhp + 2230;
					allmp = allmp + 1654;
					allpv = allpv + 27;
					allstr = allstr + 28;
					alldex = alldex + 93;
					alliint = alliint + 25;
					allweight = allweight + 60950;
					break;
				case 235:
					allhp = allhp + 2239;
					allmp = allmp + 1665;
					allpv = allpv + 27;
					allstr = allstr + 28;
					alldex = alldex + 93;
					alliint = alliint + 25;
					allweight = allweight + 61365;
					break;
				case 236:
					allhp = allhp + 2248;
					allmp = allmp + 1676;
					allpv = allpv + 27;
					allstr = allstr + 28;
					alldex = alldex + 93;
					alliint = alliint + 25;
					allweight = allweight + 61780;
					break;
				case 237:
					allhp = allhp + 2257;
					allmp = allmp + 1687;
					allpv = allpv + 27;
					allstr = allstr + 28;
					alldex = alldex + 94;
					alliint = alliint + 25;
					allweight = allweight + 62195;
					break;
				case 238:
					allhp = allhp + 2266;
					allmp = allmp + 1698;
					allpv = allpv + 27;
					allstr = allstr + 28;
					alldex = alldex + 94;
					alliint = alliint + 25;
					allweight = allweight + 62610;
					break;
				case 239:
					allhp = allhp + 2275;
					allmp = allmp + 1709;
					allpv = allpv + 27;
					allstr = allstr + 28;
					alldex = alldex + 94;
					alliint = alliint + 25;
					allweight = allweight + 63025;
					break;
				case 240:
					allhp = allhp + 2284;
					allmp = allmp + 1722;
					allpv = allpv + 27;
					allstr = allstr + 28;
					alldex = alldex + 95;
					alliint = alliint + 26;
					allweight = allweight + 63440;
					break;
				case 241:
					allhp = allhp + 2293;
					allmp = allmp + 1733;
					allpv = allpv + 27;
					allstr = allstr + 28;
					alldex = alldex + 95;
					alliint = alliint + 26;
					allweight = allweight + 63855;
					break;
				case 242:
					allhp = allhp + 2302;
					allmp = allmp + 1744;
					allpv = allpv + 27;
					allstr = allstr + 28;
					alldex = alldex + 95;
					alliint = alliint + 26;
					allweight = allweight + 64270;
					break;
				case 243:
					allhp = allhp + 2311;
					allmp = allmp + 1755;
					allpv = allpv + 28;
					allstr = allstr + 28;
					alldex = alldex + 96;
					alliint = alliint + 26;
					allweight = allweight + 64685;
					break;
				case 244:
					allhp = allhp + 2320;
					allmp = allmp + 1766;
					allpv = allpv + 28;
					allstr = allstr + 28;
					alldex = alldex + 96;
					alliint = alliint + 26;
					allweight = allweight + 65100;
					break;
				case 245:
					allhp = allhp + 2329;
					allmp = allmp + 1777;
					allpv = allpv + 28;
					allstr = allstr + 28;
					alldex = alldex + 96;
					alliint = alliint + 26;
					allweight = allweight + 65515;
					break;
				case 246:
					allhp = allhp + 2338;
					allmp = allmp + 1788;
					allpv = allpv + 28;
					allstr = allstr + 28;
					alldex = alldex + 97;
					alliint = alliint + 26;
					allweight = allweight + 65930;
					break;
				case 247:
					allhp = allhp + 2350;
					allmp = allmp + 1799;
					allpv = allpv + 28;
					allstr = allstr + 29;
					alldex = alldex + 97;
					alliint = alliint + 26;
					allweight = allweight + 66375;
					break;
				case 248:
					allhp = allhp + 2359;
					allmp = allmp + 1810;
					allpv = allpv + 28;
					allstr = allstr + 29;
					alldex = alldex + 97;
					alliint = alliint + 26;
					allweight = allweight + 66790;
					break;
				case 249:
					allhp = allhp + 2368;
					allmp = allmp + 1821;
					allpv = allpv + 28;
					allstr = allstr + 29;
					alldex = alldex + 98;
					alliint = alliint + 26;
					allweight = allweight + 67205;
					break;
				case 250:
					allhp = allhp + 2377;
					allmp = allmp + 1832;
					allpv = allpv + 28;
					allstr = allstr + 29;
					alldex = alldex + 98;
					alliint = alliint + 26;
					allweight = allweight + 67620;
					break;
                default:
                    alert("Level must be 1-250");
            }
        }

        if (iclass === 2) {
            allhp = allhp + allstr * 3;
            allweight = allweight + allstr * 30;
            allmp = allmp + alliint * 4;

            switch (parseInt(level)) {
				case 1:
					allhp = allhp + 86;
					allmp = allmp + 51;
					allpv = allpv + 1;
					allstr = allstr + 12;
					alldex = alldex + 13;
					alliint = alliint + 10;
					allweight = allweight + 3380;
					break;
				case 2:
					allhp = allhp + 96;
					allmp = allmp + 52;
					allpv = allpv + 1;
					allstr = allstr + 12;
					alldex = alldex + 13;
					alliint = alliint + 10;
					allweight = allweight + 3400;
					break;
				case 3:
					allhp = allhp + 109;
					allmp = allmp + 53;
					allpv = allpv + 1;
					allstr = allstr + 13;
					alldex = alldex + 14;
					alliint = alliint + 10;
					allweight = allweight + 3450;
					break;
				case 4:
					allhp = allhp + 119;
					allmp = allmp + 54;
					allpv = allpv + 1;
					allstr = allstr + 13;
					alldex = alldex + 14;
					alliint = alliint + 10;
					allweight = allweight + 3470;
					break;
				case 5:
					allhp = allhp + 129;
					allmp = allmp + 55;
					allpv = allpv + 1;
					allstr = allstr + 13;
					alldex = alldex + 14;
					alliint = alliint + 10;
					allweight = allweight + 3490;
					break;
				case 6:
					allhp = allhp + 142;
					allmp = allmp + 56;
					allpv = allpv + 1;
					allstr = allstr + 14;
					alldex = alldex + 15;
					alliint = alliint + 10;
					allweight = allweight + 3540;
					break;
				case 7:
					allhp = allhp + 152;
					allmp = allmp + 57;
					allpv = allpv + 1;
					allstr = allstr + 14;
					alldex = alldex + 15;
					alliint = alliint + 10;
					allweight = allweight + 3560;
					break;
				case 8:
					allhp = allhp + 162;
					allmp = allmp + 58;
					allpv = allpv + 1;
					allstr = allstr + 14;
					alldex = alldex + 15;
					alliint = alliint + 10;
					allweight = allweight + 3580;
					break;
				case 9:
					allhp = allhp + 175;
					allmp = allmp + 59;
					allpv = allpv + 1;
					allstr = allstr + 15;
					alldex = alldex + 16;
					alliint = alliint + 10;
					allweight = allweight + 3630;
					break;
				case 10:
					allhp = allhp + 185;
					allmp = allmp + 60;
					allpv = allpv + 1;
					allstr = allstr + 15;
					alldex = alldex + 16;
					alliint = alliint + 10;
					allweight = allweight + 3650;
					break;
				case 11:
					allhp = allhp + 195;
					allmp = allmp + 61;
					allpv = allpv + 1;
					allstr = allstr + 15;
					alldex = alldex + 16;
					alliint = alliint + 10;
					allweight = allweight + 3670;
					break;
				case 12:
					allhp = allhp + 208;
					allmp = allmp + 62;
					allpv = allpv + 2;
					allstr = allstr + 16;
					alldex = alldex + 17;
					alliint = alliint + 10;
					allweight = allweight + 3720;
					break;
				case 13:
					allhp = allhp + 218;
					allmp = allmp + 63;
					allpv = allpv + 2;
					allstr = allstr + 16;
					alldex = alldex + 17;
					alliint = alliint + 10;
					allweight = allweight + 3740;
					break;
				case 14:
					allhp = allhp + 228;
					allmp = allmp + 64;
					allpv = allpv + 2;
					allstr = allstr + 16;
					alldex = alldex + 17;
					alliint = alliint + 10;
					allweight = allweight + 3760;
					break;
				case 15:
					allhp = allhp + 241;
					allmp = allmp + 67;
					allpv = allpv + 2;
					allstr = allstr + 17;
					alldex = alldex + 18;
					alliint = alliint + 11;
					allweight = allweight + 3810;
					break;
				case 16:
					allhp = allhp + 251;
					allmp = allmp + 68;
					allpv = allpv + 2;
					allstr = allstr + 17;
					alldex = alldex + 18;
					alliint = alliint + 11;
					allweight = allweight + 3830;
					break;
				case 17:
					allhp = allhp + 261;
					allmp = allmp + 69;
					allpv = allpv + 2;
					allstr = allstr + 17;
					alldex = alldex + 18;
					alliint = alliint + 11;
					allweight = allweight + 3850;
					break;
				case 18:
					allhp = allhp + 274;
					allmp = allmp + 70;
					allpv = allpv + 2;
					allstr = allstr + 18;
					alldex = alldex + 19;
					alliint = alliint + 11;
					allweight = allweight + 3900;
					break;
				case 19:
					allhp = allhp + 284;
					allmp = allmp + 71;
					allpv = allpv + 2;
					allstr = allstr + 18;
					alldex = alldex + 19;
					alliint = alliint + 11;
					allweight = allweight + 3920;
					break;
				case 20:
					allhp = allhp + 294;
					allmp = allmp + 72;
					allpv = allpv + 2;
					allstr = allstr + 18;
					alldex = alldex + 19;
					alliint = alliint + 11;
					allweight = allweight + 3940;
					break;
				case 21:
					allhp = allhp + 307;
					allmp = allmp + 73;
					allpv = allpv + 2;
					allstr = allstr + 19;
					alldex = alldex + 20;
					alliint = alliint + 11;
					allweight = allweight + 3990;
					break;
				case 22:
					allhp = allhp + 317;
					allmp = allmp + 74;
					allpv = allpv + 2;
					allstr = allstr + 19;
					alldex = alldex + 20;
					alliint = alliint + 11;
					allweight = allweight + 4010;
					break;
				case 23:
					allhp = allhp + 327;
					allmp = allmp + 75;
					allpv = allpv + 2;
					allstr = allstr + 19;
					alldex = alldex + 20;
					alliint = alliint + 11;
					allweight = allweight + 4030;
					break;
				case 24:
					allhp = allhp + 340;
					allmp = allmp + 76;
					allpv = allpv + 3;
					allstr = allstr + 20;
					alldex = alldex + 21;
					alliint = alliint + 11;
					allweight = allweight + 4080;
					break;
				case 25:
					allhp = allhp + 350;
					allmp = allmp + 77;
					allpv = allpv + 3;
					allstr = allstr + 20;
					alldex = alldex + 21;
					alliint = alliint + 11;
					allweight = allweight + 4100;
					break;
				case 26:
					allhp = allhp + 360;
					allmp = allmp + 78;
					allpv = allpv + 3;
					allstr = allstr + 20;
					alldex = alldex + 21;
					alliint = alliint + 11;
					allweight = allweight + 4120;
					break;
				case 27:
					allhp = allhp + 373;
					allmp = allmp + 79;
					allpv = allpv + 3;
					allstr = allstr + 21;
					alldex = alldex + 22;
					alliint = alliint + 11;
					allweight = allweight + 4170;
					break;
				case 28:
					allhp = allhp + 383;
					allmp = allmp + 80;
					allpv = allpv + 3;
					allstr = allstr + 21;
					alldex = alldex + 22;
					alliint = alliint + 11;
					allweight = allweight + 4190;
					break;
				case 29:
					allhp = allhp + 393;
					allmp = allmp + 81;
					allpv = allpv + 3;
					allstr = allstr + 21;
					alldex = alldex + 22;
					alliint = alliint + 11;
					allweight = allweight + 4210;
					break;
				case 30:
					allhp = allhp + 406;
					allmp = allmp + 84;
					allpv = allpv + 3;
					allstr = allstr + 22;
					alldex = alldex + 23;
					alliint = alliint + 12;
					allweight = allweight + 4260;
					break;
				case 31:
					allhp = allhp + 416;
					allmp = allmp + 85;
					allpv = allpv + 3;
					allstr = allstr + 22;
					alldex = alldex + 23;
					alliint = alliint + 12;
					allweight = allweight + 4280;
					break;
				case 32:
					allhp = allhp + 426;
					allmp = allmp + 86;
					allpv = allpv + 3;
					allstr = allstr + 22;
					alldex = alldex + 23;
					alliint = alliint + 12;
					allweight = allweight + 4300;
					break;
				case 33:
					allhp = allhp + 439;
					allmp = allmp + 87;
					allpv = allpv + 3;
					allstr = allstr + 23;
					alldex = alldex + 24;
					alliint = alliint + 12;
					allweight = allweight + 4350;
					break;
				case 34:
					allhp = allhp + 449;
					allmp = allmp + 88;
					allpv = allpv + 3;
					allstr = allstr + 23;
					alldex = alldex + 24;
					alliint = alliint + 12;
					allweight = allweight + 4370;
					break;
				case 35:
					allhp = allhp + 459;
					allmp = allmp + 89;
					allpv = allpv + 3;
					allstr = allstr + 23;
					alldex = alldex + 24;
					alliint = alliint + 12;
					allweight = allweight + 4390;
					break;
				case 36:
					allhp = allhp + 472;
					allmp = allmp + 90;
					allpv = allpv + 4;
					allstr = allstr + 24;
					alldex = alldex + 25;
					alliint = alliint + 12;
					allweight = allweight + 4440;
					break;
				case 37:
					allhp = allhp + 482;
					allmp = allmp + 91;
					allpv = allpv + 4;
					allstr = allstr + 24;
					alldex = alldex + 25;
					alliint = alliint + 12;
					allweight = allweight + 4460;
					break;
				case 38:
					allhp = allhp + 492;
					allmp = allmp + 92;
					allpv = allpv + 4;
					allstr = allstr + 24;
					alldex = alldex + 25;
					alliint = alliint + 12;
					allweight = allweight + 4480;
					break;
				case 39:
					allhp = allhp + 505;
					allmp = allmp + 93;
					allpv = allpv + 4;
					allstr = allstr + 25;
					alldex = alldex + 26;
					alliint = alliint + 12;
					allweight = allweight + 4530;
					break;
				case 40:
					allhp = allhp + 515;
					allmp = allmp + 94;
					allpv = allpv + 4;
					allstr = allstr + 25;
					alldex = alldex + 26;
					alliint = alliint + 12;
					allweight = allweight + 4550;
					break;
				case 41:
					allhp = allhp + 525;
					allmp = allmp + 95;
					allpv = allpv + 4;
					allstr = allstr + 25;
					alldex = alldex + 26;
					alliint = alliint + 12;
					allweight = allweight + 4570;
					break;
				case 42:
					allhp = allhp + 538;
					allmp = allmp + 96;
					allpv = allpv + 4;
					allstr = allstr + 26;
					alldex = alldex + 27;
					alliint = alliint + 12;
					allweight = allweight + 4620;
					break;
				case 43:
					allhp = allhp + 548;
					allmp = allmp + 97;
					allpv = allpv + 4;
					allstr = allstr + 26;
					alldex = alldex + 27;
					alliint = alliint + 12;
					allweight = allweight + 4640;
					break;
				case 44:
					allhp = allhp + 558;
					allmp = allmp + 98;
					allpv = allpv + 4;
					allstr = allstr + 26;
					alldex = alldex + 27;
					alliint = alliint + 12;
					allweight = allweight + 4660;
					break;
				case 45:
					allhp = allhp + 571;
					allmp = allmp + 101;
					allpv = allpv + 4;
					allstr = allstr + 27;
					alldex = alldex + 28;
					alliint = alliint + 13;
					allweight = allweight + 4710;
					break;
				case 46:
					allhp = allhp + 581;
					allmp = allmp + 102;
					allpv = allpv + 4;
					allstr = allstr + 27;
					alldex = alldex + 28;
					alliint = alliint + 13;
					allweight = allweight + 4730;
					break;
				case 47:
					allhp = allhp + 591;
					allmp = allmp + 103;
					allpv = allpv + 4;
					allstr = allstr + 27;
					alldex = alldex + 28;
					alliint = alliint + 13;
					allweight = allweight + 4750;
					break;
				case 48:
					allhp = allhp + 604;
					allmp = allmp + 104;
					allpv = allpv + 5;
					allstr = allstr + 28;
					alldex = alldex + 29;
					alliint = alliint + 13;
					allweight = allweight + 4800;
					break;
				case 49:
					allhp = allhp + 614;
					allmp = allmp + 105;
					allpv = allpv + 5;
					allstr = allstr + 28;
					alldex = alldex + 29;
					alliint = alliint + 13;
					allweight = allweight + 4820;
					break;
				case 50:
					allhp = allhp + 624;
					allmp = allmp + 106;
					allpv = allpv + 5;
					allstr = allstr + 28;
					alldex = alldex + 29;
					alliint = alliint + 13;
					allweight = allweight + 4840;
					break;
				case 51:
					allhp = allhp + 637;
					allmp = allmp + 107;
					allpv = allpv + 5;
					allstr = allstr + 29;
					alldex = alldex + 30;
					alliint = alliint + 13;
					allweight = allweight + 4890;
					break;
				case 52:
					allhp = allhp + 647;
					allmp = allmp + 108;
					allpv = allpv + 5;
					allstr = allstr + 29;
					alldex = alldex + 30;
					alliint = alliint + 13;
					allweight = allweight + 4910;
					break;
				case 53:
					allhp = allhp + 657;
					allmp = allmp + 109;
					allpv = allpv + 5;
					allstr = allstr + 29;
					alldex = alldex + 30;
					alliint = alliint + 13;
					allweight = allweight + 4930;
					break;
				case 54:
					allhp = allhp + 670;
					allmp = allmp + 110;
					allpv = allpv + 5;
					allstr = allstr + 30;
					alldex = alldex + 31;
					alliint = alliint + 13;
					allweight = allweight + 4980;
					break;
				case 55:
					allhp = allhp + 680;
					allmp = allmp + 111;
					allpv = allpv + 5;
					allstr = allstr + 30;
					alldex = alldex + 31;
					alliint = alliint + 13;
					allweight = allweight + 5000;
					break;
				case 56:
					allhp = allhp + 690;
					allmp = allmp + 112;
					allpv = allpv + 5;
					allstr = allstr + 30;
					alldex = alldex + 31;
					alliint = alliint + 13;
					allweight = allweight + 5020;
					break;
				case 57:
					allhp = allhp + 703;
					allmp = allmp + 113;
					allpv = allpv + 5;
					allstr = allstr + 31;
					alldex = alldex + 32;
					alliint = alliint + 13;
					allweight = allweight + 5070;
					break;
				case 58:
					allhp = allhp + 713;
					allmp = allmp + 114;
					allpv = allpv + 5;
					allstr = allstr + 31;
					alldex = alldex + 32;
					alliint = alliint + 13;
					allweight = allweight + 5090;
					break;
				case 59:
					allhp = allhp + 723;
					allmp = allmp + 115;
					allpv = allpv + 5;
					allstr = allstr + 31;
					alldex = alldex + 32;
					alliint = alliint + 13;
					allweight = allweight + 5110;
					break;
				case 60:
					allhp = allhp + 736;
					allmp = allmp + 118;
					allpv = allpv + 6;
					allstr = allstr + 32;
					alldex = alldex + 33;
					alliint = alliint + 14;
					allweight = allweight + 5160;
					break;
				case 61:
					allhp = allhp + 746;
					allmp = allmp + 119;
					allpv = allpv + 6;
					allstr = allstr + 32;
					alldex = alldex + 33;
					alliint = alliint + 14;
					allweight = allweight + 5180;
					break;
				case 62:
					allhp = allhp + 756;
					allmp = allmp + 120;
					allpv = allpv + 6;
					allstr = allstr + 32;
					alldex = alldex + 33;
					alliint = alliint + 14;
					allweight = allweight + 5200;
					break;
				case 63:
					allhp = allhp + 769;
					allmp = allmp + 121;
					allpv = allpv + 6;
					allstr = allstr + 33;
					alldex = alldex + 34;
					alliint = alliint + 14;
					allweight = allweight + 5250;
					break;
				case 64:
					allhp = allhp + 779;
					allmp = allmp + 122;
					allpv = allpv + 6;
					allstr = allstr + 33;
					alldex = alldex + 34;
					alliint = alliint + 14;
					allweight = allweight + 5270;
					break;
				case 65:
					allhp = allhp + 789;
					allmp = allmp + 123;
					allpv = allpv + 6;
					allstr = allstr + 33;
					alldex = alldex + 34;
					alliint = alliint + 14;
					allweight = allweight + 5290;
					break;
				case 66:
					allhp = allhp + 802;
					allmp = allmp + 124;
					allpv = allpv + 6;
					allstr = allstr + 34;
					alldex = alldex + 35;
					alliint = alliint + 14;
					allweight = allweight + 5340;
					break;
				case 67:
					allhp = allhp + 812;
					allmp = allmp + 125;
					allpv = allpv + 6;
					allstr = allstr + 34;
					alldex = alldex + 35;
					alliint = alliint + 14;
					allweight = allweight + 5360;
					break;
				case 68:
					allhp = allhp + 822;
					allmp = allmp + 126;
					allpv = allpv + 6;
					allstr = allstr + 34;
					alldex = alldex + 35;
					alliint = alliint + 14;
					allweight = allweight + 5380;
					break;
				case 69:
					allhp = allhp + 835;
					allmp = allmp + 127;
					allpv = allpv + 6;
					allstr = allstr + 35;
					alldex = alldex + 36;
					alliint = alliint + 14;
					allweight = allweight + 5430;
					break;
				case 70:
					allhp = allhp + 845;
					allmp = allmp + 128;
					allpv = allpv + 6;
					allstr = allstr + 35;
					alldex = alldex + 36;
					alliint = alliint + 14;
					allweight = allweight + 5450;
					break;
				case 71:
					allhp = allhp + 855;
					allmp = allmp + 129;
					allpv = allpv + 6;
					allstr = allstr + 35;
					alldex = alldex + 36;
					alliint = alliint + 14;
					allweight = allweight + 5470;
					break;
				case 72:
					allhp = allhp + 868;
					allmp = allmp + 130;
					allpv = allpv + 7;
					allstr = allstr + 36;
					alldex = alldex + 37;
					alliint = alliint + 14;
					allweight = allweight + 5520;
					break;
				case 73:
					allhp = allhp + 878;
					allmp = allmp + 131;
					allpv = allpv + 7;
					allstr = allstr + 36;
					alldex = alldex + 37;
					alliint = alliint + 14;
					allweight = allweight + 5540;
					break;
				case 74:
					allhp = allhp + 888;
					allmp = allmp + 132;
					allpv = allpv + 7;
					allstr = allstr + 36;
					alldex = alldex + 37;
					alliint = alliint + 14;
					allweight = allweight + 5560;
					break;
				case 75:
					allhp = allhp + 901;
					allmp = allmp + 135;
					allpv = allpv + 7;
					allstr = allstr + 37;
					alldex = alldex + 38;
					alliint = alliint + 15;
					allweight = allweight + 5610;
					break;
				case 76:
					allhp = allhp + 911;
					allmp = allmp + 136;
					allpv = allpv + 7;
					allstr = allstr + 37;
					alldex = alldex + 38;
					alliint = alliint + 15;
					allweight = allweight + 5630;
					break;
				case 77:
					allhp = allhp + 921;
					allmp = allmp + 137;
					allpv = allpv + 7;
					allstr = allstr + 37;
					alldex = alldex + 38;
					alliint = alliint + 15;
					allweight = allweight + 5650;
					break;
				case 78:
					allhp = allhp + 934;
					allmp = allmp + 138;
					allpv = allpv + 7;
					allstr = allstr + 38;
					alldex = alldex + 39;
					alliint = alliint + 15;
					allweight = allweight + 5700;
					break;
				case 79:
					allhp = allhp + 944;
					allmp = allmp + 139;
					allpv = allpv + 7;
					allstr = allstr + 38;
					alldex = alldex + 39;
					alliint = alliint + 15;
					allweight = allweight + 5720;
					break;
				case 80:
					allhp = allhp + 954;
					allmp = allmp + 140;
					allpv = allpv + 7;
					allstr = allstr + 38;
					alldex = alldex + 39;
					alliint = alliint + 15;
					allweight = allweight + 5740;
					break;
				case 81:
					allhp = allhp + 967;
					allmp = allmp + 141;
					allpv = allpv + 7;
					allstr = allstr + 39;
					alldex = alldex + 40;
					alliint = alliint + 15;
					allweight = allweight + 5790;
					break;
				case 82:
					allhp = allhp + 977;
					allmp = allmp + 142;
					allpv = allpv + 7;
					allstr = allstr + 39;
					alldex = alldex + 40;
					alliint = alliint + 15;
					allweight = allweight + 5810;
					break;
				case 83:
					allhp = allhp + 987;
					allmp = allmp + 143;
					allpv = allpv + 7;
					allstr = allstr + 39;
					alldex = alldex + 40;
					alliint = alliint + 15;
					allweight = allweight + 5830;
					break;
				case 84:
					allhp = allhp + 1000;
					allmp = allmp + 144;
					allpv = allpv + 8;
					allstr = allstr + 40;
					alldex = alldex + 41;
					alliint = alliint + 15;
					allweight = allweight + 5880;
					break;
				case 85:
					allhp = allhp + 1010;
					allmp = allmp + 145;
					allpv = allpv + 8;
					allstr = allstr + 40;
					alldex = alldex + 41;
					alliint = alliint + 15;
					allweight = allweight + 5900;
					break;
				case 86:
					allhp = allhp + 1020;
					allmp = allmp + 146;
					allpv = allpv + 8;
					allstr = allstr + 40;
					alldex = alldex + 41;
					alliint = alliint + 15;
					allweight = allweight + 5920;
					break;
				case 87:
					allhp = allhp + 1033;
					allmp = allmp + 147;
					allpv = allpv + 8;
					allstr = allstr + 41;
					alldex = alldex + 42;
					alliint = alliint + 15;
					allweight = allweight + 5970;
					break;
				case 88:
					allhp = allhp + 1043;
					allmp = allmp + 148;
					allpv = allpv + 8;
					allstr = allstr + 41;
					alldex = alldex + 42;
					alliint = alliint + 15;
					allweight = allweight + 5990;
					break;
				case 89:
					allhp = allhp + 1053;
					allmp = allmp + 149;
					allpv = allpv + 8;
					allstr = allstr + 41;
					alldex = alldex + 42;
					alliint = alliint + 15;
					allweight = allweight + 6010;
					break;
				case 90:
					allhp = allhp + 1066;
					allmp = allmp + 152;
					allpv = allpv + 8;
					allstr = allstr + 42;
					alldex = alldex + 43;
					alliint = alliint + 16;
					allweight = allweight + 6060;
					break;
				case 91:
					allhp = allhp + 1076;
					allmp = allmp + 153;
					allpv = allpv + 8;
					allstr = allstr + 42;
					alldex = alldex + 43;
					alliint = alliint + 16;
					allweight = allweight + 6080;
					break;
				case 92:
					allhp = allhp + 1086;
					allmp = allmp + 154;
					allpv = allpv + 8;
					allstr = allstr + 42;
					alldex = alldex + 43;
					alliint = alliint + 16;
					allweight = allweight + 6100;
					break;
				case 93:
					allhp = allhp + 1099;
					allmp = allmp + 155;
					allpv = allpv + 8;
					allstr = allstr + 43;
					alldex = alldex + 44;
					alliint = alliint + 16;
					allweight = allweight + 6150;
					break;
				case 94:
					allhp = allhp + 1109;
					allmp = allmp + 156;
					allpv = allpv + 8;
					allstr = allstr + 43;
					alldex = alldex + 44;
					alliint = alliint + 16;
					allweight = allweight + 6170;
					break;
				case 95:
					allhp = allhp + 1119;
					allmp = allmp + 157;
					allpv = allpv + 8;
					allstr = allstr + 43;
					alldex = alldex + 44;
					alliint = alliint + 16;
					allweight = allweight + 6190;
					break;
				case 96:
					allhp = allhp + 1132;
					allmp = allmp + 158;
					allpv = allpv + 9;
					allstr = allstr + 44;
					alldex = alldex + 45;
					alliint = alliint + 16;
					allweight = allweight + 6240;
					break;
				case 97:
					allhp = allhp + 1142;
					allmp = allmp + 159;
					allpv = allpv + 9;
					allstr = allstr + 44;
					alldex = alldex + 45;
					alliint = alliint + 16;
					allweight = allweight + 6260;
					break;
				case 98:
					allhp = allhp + 1152;
					allmp = allmp + 160;
					allpv = allpv + 9;
					allstr = allstr + 44;
					alldex = alldex + 45;
					alliint = alliint + 16;
					allweight = allweight + 6280;
					break;
				case 99:
					allhp = allhp + 1165;
					allmp = allmp + 161;
					allpv = allpv + 9;
					allstr = allstr + 45;
					alldex = alldex + 46;
					alliint = alliint + 16;
					allweight = allweight + 6330;
					break;
				case 100:
					allhp = allhp + 1175;
					allmp = allmp + 162;
					allpv = allpv + 9;
					allstr = allstr + 45;
					alldex = alldex + 46;
					alliint = alliint + 16;
					allweight = allweight + 6350;
					break;
				case 101:
					allhp = allhp + 1185;
					allmp = allmp + 173;
					allpv = allpv + 9;
					allstr = allstr + 45;
					alldex = alldex + 46;
					alliint = alliint + 16;
					allweight = allweight + 6770;
					break;
				case 102:
					allhp = allhp + 1198;
					allmp = allmp + 184;
					allpv = allpv + 9;
					allstr = allstr + 46;
					alldex = alldex + 47;
					alliint = alliint + 16;
					allweight = allweight + 7220;
					break;
				case 103:
					allhp = allhp + 1208;
					allmp = allmp + 195;
					allpv = allpv + 9;
					allstr = allstr + 46;
					alldex = alldex + 47;
					alliint = alliint + 16;
					allweight = allweight + 7640;
					break;
				case 104:
					allhp = allhp + 1218;
					allmp = allmp + 206;
					allpv = allpv + 9;
					allstr = allstr + 46;
					alldex = alldex + 47;
					alliint = alliint + 16;
					allweight = allweight + 8060;
					break;
				case 105:
					allhp = allhp + 1231;
					allmp = allmp + 219;
					allpv = allpv + 9;
					allstr = allstr + 47;
					alldex = alldex + 48;
					alliint = alliint + 17;
					allweight = allweight + 8510;
					break;
				case 106:
					allhp = allhp + 1241;
					allmp = allmp + 230;
					allpv = allpv + 9;
					allstr = allstr + 47;
					alldex = alldex + 48;
					alliint = alliint + 17;
					allweight = allweight + 8930;
					break;
				case 107:
					allhp = allhp + 1251;
					allmp = allmp + 241;
					allpv = allpv + 9;
					allstr = allstr + 47;
					alldex = alldex + 48;
					alliint = alliint + 17;
					allweight = allweight + 9350;
					break;
				case 108:
					allhp = allhp + 1264;
					allmp = allmp + 252;
					allpv = allpv + 10;
					allstr = allstr + 48;
					alldex = alldex + 49;
					alliint = alliint + 17;
					allweight = allweight + 9800;
					break;
				case 109:
					allhp = allhp + 1274;
					allmp = allmp + 263;
					allpv = allpv + 10;
					allstr = allstr + 48;
					alldex = alldex + 49;
					alliint = alliint + 17;
					allweight = allweight + 10220;
					break;
				case 110:
					allhp = allhp + 1284;
					allmp = allmp + 274;
					allpv = allpv + 10;
					allstr = allstr + 48;
					alldex = alldex + 49;
					alliint = alliint + 17;
					allweight = allweight + 10640;
					break;
				case 111:
					allhp = allhp + 1297;
					allmp = allmp + 285;
					allpv = allpv + 10;
					allstr = allstr + 49;
					alldex = alldex + 50;
					alliint = alliint + 17;
					allweight = allweight + 11090;
					break;
				case 112:
					allhp = allhp + 1307;
					allmp = allmp + 296;
					allpv = allpv + 10;
					allstr = allstr + 49;
					alldex = alldex + 50;
					alliint = alliint + 17;
					allweight = allweight + 11510;
					break;
				case 113:
					allhp = allhp + 1317;
					allmp = allmp + 307;
					allpv = allpv + 10;
					allstr = allstr + 49;
					alldex = alldex + 50;
					alliint = alliint + 17;
					allweight = allweight + 11930;
					break;
				case 114:
					allhp = allhp + 1330;
					allmp = allmp + 318;
					allpv = allpv + 10;
					allstr = allstr + 50;
					alldex = alldex + 51;
					alliint = alliint + 17;
					allweight = allweight + 12380;
					break;
				case 115:
					allhp = allhp + 1340;
					allmp = allmp + 329;
					allpv = allpv + 10;
					allstr = allstr + 50;
					alldex = alldex + 51;
					alliint = alliint + 17;
					allweight = allweight + 12800;
					break;
				case 116:
					allhp = allhp + 1350;
					allmp = allmp + 340;
					allpv = allpv + 10;
					allstr = allstr + 50;
					alldex = alldex + 51;
					alliint = alliint + 17;
					allweight = allweight + 13220;
					break;
				case 117:
					allhp = allhp + 1363;
					allmp = allmp + 351;
					allpv = allpv + 10;
					allstr = allstr + 51;
					alldex = alldex + 52;
					alliint = alliint + 17;
					allweight = allweight + 13670;
					break;
				case 118:
					allhp = allhp + 1373;
					allmp = allmp + 362;
					allpv = allpv + 10;
					allstr = allstr + 51;
					alldex = alldex + 52;
					alliint = alliint + 17;
					allweight = allweight + 14090;
					break;
				case 119:
					allhp = allhp + 1383;
					allmp = allmp + 373;
					allpv = allpv + 10;
					allstr = allstr + 51;
					alldex = alldex + 52;
					alliint = alliint + 17;
					allweight = allweight + 14510;
					break;
				case 120:
					allhp = allhp + 1396;
					allmp = allmp + 386;
					allpv = allpv + 11;
					allstr = allstr + 52;
					alldex = alldex + 53;
					alliint = alliint + 18;
					allweight = allweight + 14960;
					break;
				case 121:
					allhp = allhp + 1406;
					allmp = allmp + 397;
					allpv = allpv + 11;
					allstr = allstr + 52;
					alldex = alldex + 53;
					alliint = alliint + 18;
					allweight = allweight + 15380;
					break;
				case 122:
					allhp = allhp + 1416;
					allmp = allmp + 408;
					allpv = allpv + 11;
					allstr = allstr + 52;
					alldex = alldex + 53;
					alliint = alliint + 18;
					allweight = allweight + 15800;
					break;
				case 123:
					allhp = allhp + 1429;
					allmp = allmp + 419;
					allpv = allpv + 11;
					allstr = allstr + 53;
					alldex = alldex + 54;
					alliint = alliint + 18;
					allweight = allweight + 16250;
					break;
				case 124:
					allhp = allhp + 1439;
					allmp = allmp + 430;
					allpv = allpv + 11;
					allstr = allstr + 53;
					alldex = alldex + 54;
					alliint = alliint + 18;
					allweight = allweight + 16670;
					break;
				case 125:
					allhp = allhp + 1449;
					allmp = allmp + 441;
					allpv = allpv + 11;
					allstr = allstr + 53;
					alldex = alldex + 54;
					alliint = alliint + 18;
					allweight = allweight + 17090;
					break;
				case 126:
					allhp = allhp + 1462;
					allmp = allmp + 452;
					allpv = allpv + 11;
					allstr = allstr + 54;
					alldex = alldex + 55;
					alliint = alliint + 18;
					allweight = allweight + 17540;
					break;
				case 127:
					allhp = allhp + 1472;
					allmp = allmp + 463;
					allpv = allpv + 11;
					allstr = allstr + 54;
					alldex = alldex + 55;
					alliint = alliint + 18;
					allweight = allweight + 17960;
					break;
				case 128:
					allhp = allhp + 1482;
					allmp = allmp + 474;
					allpv = allpv + 11;
					allstr = allstr + 54;
					alldex = alldex + 55;
					alliint = alliint + 18;
					allweight = allweight + 18380;
					break;
				case 129:
					allhp = allhp + 1495;
					allmp = allmp + 485;
					allpv = allpv + 11;
					allstr = allstr + 55;
					alldex = alldex + 56;
					alliint = alliint + 18;
					allweight = allweight + 18830;
					break;
				case 130:
					allhp = allhp + 1505;
					allmp = allmp + 496;
					allpv = allpv + 11;
					allstr = allstr + 55;
					alldex = alldex + 56;
					alliint = alliint + 18;
					allweight = allweight + 19250;
					break;
				case 131:
					allhp = allhp + 1515;
					allmp = allmp + 507;
					allpv = allpv + 11;
					allstr = allstr + 55;
					alldex = alldex + 56;
					alliint = alliint + 18;
					allweight = allweight + 19670;
					break;
				case 132:
					allhp = allhp + 1528;
					allmp = allmp + 518;
					allpv = allpv + 12;
					allstr = allstr + 56;
					alldex = alldex + 57;
					alliint = alliint + 18;
					allweight = allweight + 20120;
					break;
				case 133:
					allhp = allhp + 1538;
					allmp = allmp + 529;
					allpv = allpv + 12;
					allstr = allstr + 56;
					alldex = alldex + 57;
					alliint = alliint + 18;
					allweight = allweight + 20540;
					break;
				case 134:
					allhp = allhp + 1548;
					allmp = allmp + 540;
					allpv = allpv + 12;
					allstr = allstr + 56;
					alldex = alldex + 57;
					alliint = alliint + 18;
					allweight = allweight + 20960;
					break;
				case 135:
					allhp = allhp + 1561;
					allmp = allmp + 553;
					allpv = allpv + 12;
					allstr = allstr + 57;
					alldex = alldex + 58;
					alliint = alliint + 19;
					allweight = allweight + 21410;
					break;
				case 136:
					allhp = allhp + 1571;
					allmp = allmp + 564;
					allpv = allpv + 12;
					allstr = allstr + 57;
					alldex = alldex + 58;
					alliint = alliint + 19;
					allweight = allweight + 21830;
					break;
				case 137:
					allhp = allhp + 1581;
					allmp = allmp + 575;
					allpv = allpv + 12;
					allstr = allstr + 57;
					alldex = alldex + 58;
					alliint = alliint + 19;
					allweight = allweight + 22250;
					break;
				case 138:
					allhp = allhp + 1594;
					allmp = allmp + 586;
					allpv = allpv + 12;
					allstr = allstr + 58;
					alldex = alldex + 59;
					alliint = alliint + 19;
					allweight = allweight + 22700;
					break;
				case 139:
					allhp = allhp + 1604;
					allmp = allmp + 597;
					allpv = allpv + 12;
					allstr = allstr + 58;
					alldex = alldex + 59;
					alliint = alliint + 19;
					allweight = allweight + 23120;
					break;
				case 140:
					allhp = allhp + 1614;
					allmp = allmp + 608;
					allpv = allpv + 12;
					allstr = allstr + 58;
					alldex = alldex + 59;
					alliint = alliint + 19;
					allweight = allweight + 23540;
					break;
				case 141:
					allhp = allhp + 1627;
					allmp = allmp + 619;
					allpv = allpv + 12;
					allstr = allstr + 59;
					alldex = alldex + 60;
					alliint = alliint + 19;
					allweight = allweight + 23990;
					break;
				case 142:
					allhp = allhp + 1637;
					allmp = allmp + 630;
					allpv = allpv + 12;
					allstr = allstr + 59;
					alldex = alldex + 60;
					alliint = alliint + 19;
					allweight = allweight + 24410;
					break;
				case 143:
					allhp = allhp + 1647;
					allmp = allmp + 641;
					allpv = allpv + 12;
					allstr = allstr + 59;
					alldex = alldex + 60;
					alliint = alliint + 19;
					allweight = allweight + 24830;
					break;
				case 144:
					allhp = allhp + 1660;
					allmp = allmp + 652;
					allpv = allpv + 13;
					allstr = allstr + 60;
					alldex = alldex + 61;
					alliint = alliint + 19;
					allweight = allweight + 25280;
					break;
				case 145:
					allhp = allhp + 1670;
					allmp = allmp + 663;
					allpv = allpv + 13;
					allstr = allstr + 60;
					alldex = alldex + 61;
					alliint = alliint + 19;
					allweight = allweight + 25700;
					break;
				case 146:
					allhp = allhp + 1680;
					allmp = allmp + 674;
					allpv = allpv + 13;
					allstr = allstr + 60;
					alldex = alldex + 61;
					alliint = alliint + 19;
					allweight = allweight + 26120;
					break;
				case 147:
					allhp = allhp + 1693;
					allmp = allmp + 685;
					allpv = allpv + 13;
					allstr = allstr + 61;
					alldex = alldex + 62;
					alliint = alliint + 19;
					allweight = allweight + 26570;
					break;
				case 148:
					allhp = allhp + 1703;
					allmp = allmp + 696;
					allpv = allpv + 13;
					allstr = allstr + 61;
					alldex = alldex + 62;
					alliint = alliint + 19;
					allweight = allweight + 26990;
					break;
				case 149:
					allhp = allhp + 1713;
					allmp = allmp + 707;
					allpv = allpv + 13;
					allstr = allstr + 61;
					alldex = alldex + 62;
					alliint = alliint + 19;
					allweight = allweight + 27410;
					break;
				case 150:
					allhp = allhp + 1726;
					allmp = allmp + 720;
					allpv = allpv + 13;
					allstr = allstr + 62;
					alldex = alldex + 63;
					alliint = alliint + 20;
					allweight = allweight + 27860;
					break;
				case 151:
					allhp = allhp + 1736;
					allmp = allmp + 731;
					allpv = allpv + 13;
					allstr = allstr + 62;
					alldex = alldex + 63;
					alliint = alliint + 20;
					allweight = allweight + 28280;
					break;
				case 152:
					allhp = allhp + 1746;
					allmp = allmp + 742;
					allpv = allpv + 13;
					allstr = allstr + 62;
					alldex = alldex + 63;
					alliint = alliint + 20;
					allweight = allweight + 28700;
					break;
				case 153:
					allhp = allhp + 1759;
					allmp = allmp + 753;
					allpv = allpv + 13;
					allstr = allstr + 63;
					alldex = alldex + 64;
					alliint = alliint + 20;
					allweight = allweight + 29150;
					break;
				case 154:
					allhp = allhp + 1769;
					allmp = allmp + 764;
					allpv = allpv + 13;
					allstr = allstr + 63;
					alldex = alldex + 64;
					alliint = alliint + 20;
					allweight = allweight + 29570;
					break;
				case 155:
					allhp = allhp + 1779;
					allmp = allmp + 775;
					allpv = allpv + 13;
					allstr = allstr + 63;
					alldex = alldex + 64;
					alliint = alliint + 20;
					allweight = allweight + 29990;
					break;
				case 156:
					allhp = allhp + 1792;
					allmp = allmp + 786;
					allpv = allpv + 14;
					allstr = allstr + 64;
					alldex = alldex + 65;
					alliint = alliint + 20;
					allweight = allweight + 30440;
					break;
				case 157:
					allhp = allhp + 1802;
					allmp = allmp + 797;
					allpv = allpv + 14;
					allstr = allstr + 64;
					alldex = alldex + 65;
					alliint = alliint + 20;
					allweight = allweight + 30860;
					break;
				case 158:
					allhp = allhp + 1812;
					allmp = allmp + 808;
					allpv = allpv + 14;
					allstr = allstr + 64;
					alldex = alldex + 65;
					alliint = alliint + 20;
					allweight = allweight + 31280;
					break;
				case 159:
					allhp = allhp + 1825;
					allmp = allmp + 819;
					allpv = allpv + 14;
					allstr = allstr + 65;
					alldex = alldex + 66;
					alliint = alliint + 20;
					allweight = allweight + 31730;
					break;
				case 160:
					allhp = allhp + 1835;
					allmp = allmp + 830;
					allpv = allpv + 14;
					allstr = allstr + 65;
					alldex = alldex + 66;
					alliint = alliint + 20;
					allweight = allweight + 32150;
					break;
				case 161:
					allhp = allhp + 1845;
					allmp = allmp + 841;
					allpv = allpv + 14;
					allstr = allstr + 65;
					alldex = alldex + 66;
					alliint = alliint + 20;
					allweight = allweight + 32570;
					break;
				case 162:
					allhp = allhp + 1858;
					allmp = allmp + 852;
					allpv = allpv + 14;
					allstr = allstr + 66;
					alldex = alldex + 67;
					alliint = alliint + 20;
					allweight = allweight + 33020;
					break;
				case 163:
					allhp = allhp + 1868;
					allmp = allmp + 863;
					allpv = allpv + 14;
					allstr = allstr + 66;
					alldex = alldex + 67;
					alliint = alliint + 20;
					allweight = allweight + 33440;
					break;
				case 164:
					allhp = allhp + 1878;
					allmp = allmp + 874;
					allpv = allpv + 14;
					allstr = allstr + 66;
					alldex = alldex + 67;
					alliint = alliint + 20;
					allweight = allweight + 33860;
					break;
				case 165:
					allhp = allhp + 1891;
					allmp = allmp + 887;
					allpv = allpv + 14;
					allstr = allstr + 67;
					alldex = alldex + 68;
					alliint = alliint + 21;
					allweight = allweight + 34310;
					break;
				case 166:
					allhp = allhp + 1901;
					allmp = allmp + 898;
					allpv = allpv + 14;
					allstr = allstr + 67;
					alldex = alldex + 68;
					alliint = alliint + 21;
					allweight = allweight + 34730;
					break;
				case 167:
					allhp = allhp + 1911;
					allmp = allmp + 909;
					allpv = allpv + 14;
					allstr = allstr + 67;
					alldex = alldex + 68;
					alliint = alliint + 21;
					allweight = allweight + 35150;
					break;
				case 168:
					allhp = allhp + 1924;
					allmp = allmp + 920;
					allpv = allpv + 15;
					allstr = allstr + 68;
					alldex = alldex + 69;
					alliint = alliint + 21;
					allweight = allweight + 35600;
					break;
				case 169:
					allhp = allhp + 1934;
					allmp = allmp + 931;
					allpv = allpv + 15;
					allstr = allstr + 68;
					alldex = alldex + 69;
					alliint = alliint + 21;
					allweight = allweight + 36020;
					break;
				case 170:
					allhp = allhp + 1944;
					allmp = allmp + 942;
					allpv = allpv + 15;
					allstr = allstr + 68;
					alldex = alldex + 69;
					alliint = alliint + 21;
					allweight = allweight + 36440;
					break;
				case 171:
					allhp = allhp + 1957;
					allmp = allmp + 953;
					allpv = allpv + 15;
					allstr = allstr + 69;
					alldex = alldex + 70;
					alliint = alliint + 21;
					allweight = allweight + 36890;
					break;
				case 172:
					allhp = allhp + 1967;
					allmp = allmp + 964;
					allpv = allpv + 15;
					allstr = allstr + 69;
					alldex = alldex + 70;
					alliint = alliint + 21;
					allweight = allweight + 37310;
					break;
				case 173:
					allhp = allhp + 1977;
					allmp = allmp + 975;
					allpv = allpv + 15;
					allstr = allstr + 69;
					alldex = alldex + 70;
					alliint = alliint + 21;
					allweight = allweight + 37730;
					break;
				case 174:
					allhp = allhp + 1990;
					allmp = allmp + 986;
					allpv = allpv + 15;
					allstr = allstr + 70;
					alldex = alldex + 71;
					alliint = alliint + 21;
					allweight = allweight + 38180;
					break;
				case 175:
					allhp = allhp + 2000;
					allmp = allmp + 997;
					allpv = allpv + 15;
					allstr = allstr + 70;
					alldex = alldex + 71;
					alliint = alliint + 21;
					allweight = allweight + 38600;
					break;
				case 176:
					allhp = allhp + 2010;
					allmp = allmp + 1008;
					allpv = allpv + 15;
					allstr = allstr + 70;
					alldex = alldex + 71;
					alliint = alliint + 21;
					allweight = allweight + 39020;
					break;
				case 177:
					allhp = allhp + 2023;
					allmp = allmp + 1019;
					allpv = allpv + 15;
					allstr = allstr + 71;
					alldex = alldex + 72;
					alliint = alliint + 21;
					allweight = allweight + 39470;
					break;
				case 178:
					allhp = allhp + 2033;
					allmp = allmp + 1030;
					allpv = allpv + 15;
					allstr = allstr + 71;
					alldex = alldex + 72;
					alliint = alliint + 21;
					allweight = allweight + 39890;
					break;
				case 179:
					allhp = allhp + 2043;
					allmp = allmp + 1041;
					allpv = allpv + 15;
					allstr = allstr + 71;
					alldex = alldex + 72;
					alliint = alliint + 21;
					allweight = allweight + 40310;
					break;
				case 180:
					allhp = allhp + 2056;
					allmp = allmp + 1054;
					allpv = allpv + 16;
					allstr = allstr + 72;
					alldex = alldex + 73;
					alliint = alliint + 22;
					allweight = allweight + 40760;
					break;
				case 181:
					allhp = allhp + 2066;
					allmp = allmp + 1065;
					allpv = allpv + 16;
					allstr = allstr + 72;
					alldex = alldex + 73;
					alliint = alliint + 22;
					allweight = allweight + 41180;
					break;
				case 182:
					allhp = allhp + 2076;
					allmp = allmp + 1076;
					allpv = allpv + 16;
					allstr = allstr + 72;
					alldex = alldex + 73;
					alliint = alliint + 22;
					allweight = allweight + 41600;
					break;
				case 183:
					allhp = allhp + 2089;
					allmp = allmp + 1087;
					allpv = allpv + 16;
					allstr = allstr + 73;
					alldex = alldex + 74;
					alliint = alliint + 22;
					allweight = allweight + 42050;
					break;
				case 184:
					allhp = allhp + 2099;
					allmp = allmp + 1098;
					allpv = allpv + 16;
					allstr = allstr + 73;
					alldex = alldex + 74;
					alliint = alliint + 22;
					allweight = allweight + 42470;
					break;
				case 185:
					allhp = allhp + 2109;
					allmp = allmp + 1109;
					allpv = allpv + 16;
					allstr = allstr + 73;
					alldex = alldex + 74;
					alliint = alliint + 22;
					allweight = allweight + 42890;
					break;
				case 186:
					allhp = allhp + 2122;
					allmp = allmp + 1120;
					allpv = allpv + 16;
					allstr = allstr + 74;
					alldex = alldex + 75;
					alliint = alliint + 22;
					allweight = allweight + 43340;
					break;
				case 187:
					allhp = allhp + 2132;
					allmp = allmp + 1131;
					allpv = allpv + 16;
					allstr = allstr + 74;
					alldex = alldex + 75;
					alliint = alliint + 22;
					allweight = allweight + 43760;
					break;
				case 188:
					allhp = allhp + 2142;
					allmp = allmp + 1142;
					allpv = allpv + 16;
					allstr = allstr + 74;
					alldex = alldex + 75;
					alliint = alliint + 22;
					allweight = allweight + 44180;
					break;
				case 189:
					allhp = allhp + 2155;
					allmp = allmp + 1153;
					allpv = allpv + 16;
					allstr = allstr + 75;
					alldex = alldex + 76;
					alliint = alliint + 22;
					allweight = allweight + 44630;
					break;
				case 190:
					allhp = allhp + 2165;
					allmp = allmp + 1164;
					allpv = allpv + 16;
					allstr = allstr + 75;
					alldex = alldex + 76;
					alliint = alliint + 22;
					allweight = allweight + 45050;
					break;
				case 191:
					allhp = allhp + 2175;
					allmp = allmp + 1175;
					allpv = allpv + 16;
					allstr = allstr + 75;
					alldex = alldex + 76;
					alliint = alliint + 22;
					allweight = allweight + 45470;
					break;
				case 192:
					allhp = allhp + 2188;
					allmp = allmp + 1186;
					allpv = allpv + 17;
					allstr = allstr + 76;
					alldex = alldex + 77;
					alliint = alliint + 22;
					allweight = allweight + 45920;
					break;
				case 193:
					allhp = allhp + 2198;
					allmp = allmp + 1197;
					allpv = allpv + 17;
					allstr = allstr + 76;
					alldex = alldex + 77;
					alliint = alliint + 22;
					allweight = allweight + 46340;
					break;
				case 194:
					allhp = allhp + 2208;
					allmp = allmp + 1208;
					allpv = allpv + 17;
					allstr = allstr + 76;
					alldex = alldex + 77;
					alliint = alliint + 22;
					allweight = allweight + 46760;
					break;
				case 195:
					allhp = allhp + 2221;
					allmp = allmp + 1221;
					allpv = allpv + 17;
					allstr = allstr + 77;
					alldex = alldex + 78;
					alliint = alliint + 23;
					allweight = allweight + 47210;
					break;
				case 196:
					allhp = allhp + 2231;
					allmp = allmp + 1232;
					allpv = allpv + 17;
					allstr = allstr + 77;
					alldex = alldex + 78;
					alliint = alliint + 23;
					allweight = allweight + 47630;
					break;
				case 197:
					allhp = allhp + 2241;
					allmp = allmp + 1243;
					allpv = allpv + 17;
					allstr = allstr + 77;
					alldex = alldex + 78;
					alliint = alliint + 23;
					allweight = allweight + 48050;
					break;
				case 198:
					allhp = allhp + 2254;
					allmp = allmp + 1254;
					allpv = allpv + 17;
					allstr = allstr + 78;
					alldex = alldex + 79;
					alliint = alliint + 23;
					allweight = allweight + 48500;
					break;
				case 199:
					allhp = allhp + 2264;
					allmp = allmp + 1265;
					allpv = allpv + 17;
					allstr = allstr + 78;
					alldex = alldex + 79;
					alliint = alliint + 23;
					allweight = allweight + 48920;
					break;
				case 200:
					allhp = allhp + 2274;
					allmp = allmp + 1276;
					allpv = allpv + 17;
					allstr = allstr + 78;
					alldex = alldex + 79;
					alliint = alliint + 23;
					allweight = allweight + 49340;
					break;
				case 201:
					allhp = allhp + 2287;
					allmp = allmp + 1287;
					allpv = allpv + 17;
					allstr = allstr + 79;
					alldex = alldex + 80;
					alliint = alliint + 23;
					allweight = allweight + 49790;
					break;
				case 202:
					allhp = allhp + 2297;
					allmp = allmp + 1298;
					allpv = allpv + 17;
					allstr = allstr + 79;
					alldex = alldex + 80;
					alliint = alliint + 23;
					allweight = allweight + 50210;
					break;
				case 203:
					allhp = allhp + 2307;
					allmp = allmp + 1309;
					allpv = allpv + 17;
					allstr = allstr + 79;
					alldex = alldex + 80;
					alliint = alliint + 23;
					allweight = allweight + 50630;
					break;
				case 204:
					allhp = allhp + 2320;
					allmp = allmp + 1320;
					allpv = allpv + 18;
					allstr = allstr + 80;
					alldex = alldex + 81;
					alliint = alliint + 23;
					allweight = allweight + 51080;
					break;
				case 205:
					allhp = allhp + 2330;
					allmp = allmp + 1331;
					allpv = allpv + 18;
					allstr = allstr + 80;
					alldex = alldex + 81;
					alliint = alliint + 23;
					allweight = allweight + 51500;
					break;
				case 206:
					allhp = allhp + 2340;
					allmp = allmp + 1342;
					allpv = allpv + 18;
					allstr = allstr + 80;
					alldex = alldex + 81;
					alliint = alliint + 23;
					allweight = allweight + 51920;
					break;
				case 207:
					allhp = allhp + 2353;
					allmp = allmp + 1353;
					allpv = allpv + 18;
					allstr = allstr + 81;
					alldex = alldex + 82;
					alliint = alliint + 23;
					allweight = allweight + 52370;
					break;
				case 208:
					allhp = allhp + 2363;
					allmp = allmp + 1364;
					allpv = allpv + 18;
					allstr = allstr + 81;
					alldex = alldex + 82;
					alliint = alliint + 23;
					allweight = allweight + 52790;
					break;
				case 209:
					allhp = allhp + 2373;
					allmp = allmp + 1375;
					allpv = allpv + 18;
					allstr = allstr + 81;
					alldex = alldex + 82;
					alliint = alliint + 23;
					allweight = allweight + 53210;
					break;
				case 210:
					allhp = allhp + 2386;
					allmp = allmp + 1388;
					allpv = allpv + 18;
					allstr = allstr + 82;
					alldex = alldex + 83;
					alliint = alliint + 24;
					allweight = allweight + 53660;
					break;
				case 211:
					allhp = allhp + 2396;
					allmp = allmp + 1399;
					allpv = allpv + 18;
					allstr = allstr + 82;
					alldex = alldex + 83;
					alliint = alliint + 24;
					allweight = allweight + 54080;
					break;
				case 212:
					allhp = allhp + 2406;
					allmp = allmp + 1410;
					allpv = allpv + 18;
					allstr = allstr + 82;
					alldex = alldex + 83;
					alliint = alliint + 24;
					allweight = allweight + 54500;
					break;
				case 213:
					allhp = allhp + 2419;
					allmp = allmp + 1421;
					allpv = allpv + 18;
					allstr = allstr + 83;
					alldex = alldex + 84;
					alliint = alliint + 24;
					allweight = allweight + 54950;
					break;
				case 214:
					allhp = allhp + 2429;
					allmp = allmp + 1432;
					allpv = allpv + 18;
					allstr = allstr + 83;
					alldex = alldex + 84;
					alliint = alliint + 24;
					allweight = allweight + 55370;
					break;
				case 215:
					allhp = allhp + 2439;
					allmp = allmp + 1443;
					allpv = allpv + 18;
					allstr = allstr + 83;
					alldex = alldex + 84;
					alliint = alliint + 24;
					allweight = allweight + 55790;
					break;
				case 216:
					allhp = allhp + 2452;
					allmp = allmp + 1454;
					allpv = allpv + 19;
					allstr = allstr + 84;
					alldex = alldex + 85;
					alliint = alliint + 24;
					allweight = allweight + 56240;
					break;
				case 217:
					allhp = allhp + 2462;
					allmp = allmp + 1465;
					allpv = allpv + 19;
					allstr = allstr + 84;
					alldex = alldex + 85;
					alliint = alliint + 24;
					allweight = allweight + 56660;
					break;
				case 218:
					allhp = allhp + 2472;
					allmp = allmp + 1476;
					allpv = allpv + 19;
					allstr = allstr + 84;
					alldex = alldex + 85;
					alliint = alliint + 24;
					allweight = allweight + 57080;
					break;
				case 219:
					allhp = allhp + 2485;
					allmp = allmp + 1487;
					allpv = allpv + 19;
					allstr = allstr + 85;
					alldex = alldex + 86;
					alliint = alliint + 24;
					allweight = allweight + 57530;
					break;
				case 220:
					allhp = allhp + 2495;
					allmp = allmp + 1498;
					allpv = allpv + 19;
					allstr = allstr + 85;
					alldex = alldex + 86;
					alliint = alliint + 24;
					allweight = allweight + 57950;
					break;
				case 221:
					allhp = allhp + 2505;
					allmp = allmp + 1509;
					allpv = allpv + 19;
					allstr = allstr + 85;
					alldex = alldex + 86;
					alliint = alliint + 24;
					allweight = allweight + 58370;
					break;
				case 222:
					allhp = allhp + 2518;
					allmp = allmp + 1520;
					allpv = allpv + 19;
					allstr = allstr + 86;
					alldex = alldex + 87;
					alliint = alliint + 24;
					allweight = allweight + 58820;
					break;
				case 223:
					allhp = allhp + 2528;
					allmp = allmp + 1531;
					allpv = allpv + 19;
					allstr = allstr + 86;
					alldex = alldex + 87;
					alliint = alliint + 24;
					allweight = allweight + 59240;
					break;
				case 224:
					allhp = allhp + 2538;
					allmp = allmp + 1542;
					allpv = allpv + 19;
					allstr = allstr + 86;
					alldex = alldex + 87;
					alliint = alliint + 24;
					allweight = allweight + 59660;
					break;
				case 225:
					allhp = allhp + 2551;
					allmp = allmp + 1555;
					allpv = allpv + 19;
					allstr = allstr + 87;
					alldex = alldex + 88;
					alliint = alliint + 25;
					allweight = allweight + 60110;
					break;
				case 226:
					allhp = allhp + 2561;
					allmp = allmp + 1566;
					allpv = allpv + 19;
					allstr = allstr + 87;
					alldex = alldex + 88;
					alliint = alliint + 25;
					allweight = allweight + 60530;
					break;
				case 227:
					allhp = allhp + 2571;
					allmp = allmp + 1577;
					allpv = allpv + 19;
					allstr = allstr + 87;
					alldex = alldex + 88;
					alliint = alliint + 25;
					allweight = allweight + 60950;
					break;
				case 228:
					allhp = allhp + 2584;
					allmp = allmp + 1588;
					allpv = allpv + 20;
					allstr = allstr + 88;
					alldex = alldex + 89;
					alliint = alliint + 25;
					allweight = allweight + 61400;
					break;
				case 229:
					allhp = allhp + 2594;
					allmp = allmp + 1599;
					allpv = allpv + 20;
					allstr = allstr + 88;
					alldex = alldex + 89;
					alliint = alliint + 25;
					allweight = allweight + 61820;
					break;
				case 230:
					allhp = allhp + 2604;
					allmp = allmp + 1610;
					allpv = allpv + 20;
					allstr = allstr + 88;
					alldex = alldex + 89;
					alliint = alliint + 25;
					allweight = allweight + 62240;
					break;
				case 231:
					allhp = allhp + 2617;
					allmp = allmp + 1621;
					allpv = allpv + 20;
					allstr = allstr + 89;
					alldex = alldex + 90;
					alliint = alliint + 25;
					allweight = allweight + 62690;
					break;
				case 232:
					allhp = allhp + 2627;
					allmp = allmp + 1632;
					allpv = allpv + 20;
					allstr = allstr + 89;
					alldex = alldex + 90;
					alliint = alliint + 25;
					allweight = allweight + 63110;
					break;
				case 233:
					allhp = allhp + 2637;
					allmp = allmp + 1643;
					allpv = allpv + 20;
					allstr = allstr + 89;
					alldex = alldex + 90;
					alliint = alliint + 25;
					allweight = allweight + 63530;
					break;
				case 234:
					allhp = allhp + 2650;
					allmp = allmp + 1654;
					allpv = allpv + 20;
					allstr = allstr + 90;
					alldex = alldex + 91;
					alliint = alliint + 25;
					allweight = allweight + 63980;
					break;
				case 235:
					allhp = allhp + 2660;
					allmp = allmp + 1665;
					allpv = allpv + 20;
					allstr = allstr + 90;
					alldex = alldex + 91;
					alliint = alliint + 25;
					allweight = allweight + 64400;
					break;
				case 236:
					allhp = allhp + 2670;
					allmp = allmp + 1676;
					allpv = allpv + 20;
					allstr = allstr + 90;
					alldex = alldex + 91;
					alliint = alliint + 25;
					allweight = allweight + 64820;
					break;
				case 237:
					allhp = allhp + 2683;
					allmp = allmp + 1687;
					allpv = allpv + 20;
					allstr = allstr + 91;
					alldex = alldex + 92;
					alliint = alliint + 25;
					allweight = allweight + 65270;
					break;
				case 238:
					allhp = allhp + 2693;
					allmp = allmp + 1698;
					allpv = allpv + 20;
					allstr = allstr + 91;
					alldex = alldex + 92;
					alliint = alliint + 25;
					allweight = allweight + 65690;
					break;
				case 239:
					allhp = allhp + 2703;
					allmp = allmp + 1709;
					allpv = allpv + 20;
					allstr = allstr + 91;
					alldex = alldex + 92;
					alliint = alliint + 25;
					allweight = allweight + 66110;
					break;
				case 240:
					allhp = allhp + 2716;
					allmp = allmp + 1722;
					allpv = allpv + 21;
					allstr = allstr + 92;
					alldex = alldex + 93;
					alliint = alliint + 26;
					allweight = allweight + 66560;
					break;
				case 241:
					allhp = allhp + 2726;
					allmp = allmp + 1733;
					allpv = allpv + 21;
					allstr = allstr + 92;
					alldex = alldex + 93;
					alliint = alliint + 26;
					allweight = allweight + 66980;
					break;
				case 242:
					allhp = allhp + 2736;
					allmp = allmp + 1744;
					allpv = allpv + 21;
					allstr = allstr + 92;
					alldex = alldex + 93;
					alliint = alliint + 26;
					allweight = allweight + 67400;
					break;
				case 243:
					allhp = allhp + 2749;
					allmp = allmp + 1755;
					allpv = allpv + 21;
					allstr = allstr + 93;
					alldex = alldex + 94;
					alliint = alliint + 26;
					allweight = allweight + 67850;
					break;
				case 244:
					allhp = allhp + 2759;
					allmp = allmp + 1766;
					allpv = allpv + 21;
					allstr = allstr + 93;
					alldex = alldex + 94;
					alliint = alliint + 26;
					allweight = allweight + 68270;
					break;
				case 245:
					allhp = allhp + 2769;
					allmp = allmp + 1777;
					allpv = allpv + 21;
					allstr = allstr + 93;
					alldex = alldex + 94;
					alliint = alliint + 26;
					allweight = allweight + 68690;
					break;
				case 246:
					allhp = allhp + 2782;
					allmp = allmp + 1788;
					allpv = allpv + 21;
					allstr = allstr + 94;
					alldex = alldex + 95;
					alliint = alliint + 26;
					allweight = allweight + 69140;
					break;
				case 247:
					allhp = allhp + 2792;
					allmp = allmp + 1799;
					allpv = allpv + 21;
					allstr = allstr + 94;
					alldex = alldex + 95;
					alliint = alliint + 26;
					allweight = allweight + 69560;
					break;
				case 248:
					allhp = allhp + 2802;
					allmp = allmp + 1810;
					allpv = allpv + 21;
					allstr = allstr + 94;
					alldex = alldex + 95;
					alliint = alliint + 26;
					allweight = allweight + 69980;
					break;
				case 249:
					allhp = allhp + 2815;
					allmp = allmp + 1821;
					allpv = allpv + 21;
					allstr = allstr + 95;
					alldex = alldex + 96;
					alliint = alliint + 26;
					allweight = allweight + 70430;
					break;
				case 250:
					allhp = allhp + 2825;
					allmp = allmp + 1832;
					allpv = allpv + 21;
					allstr = allstr + 95;
					alldex = alldex + 96;
					alliint = alliint + 26;
					allweight = allweight + 70850;
					break;
                default:
                    alert("Level must be 1-250");
            }
        }

        if (iclass === 3) {
            allhp = allhp + allstr * 3;
            allweight = allweight + allstr * 30;
            allmp = allmp + alliint * 3;

            if (alldex % 5 == 0) {
                allpv = allpv + (alldex / 5);
            }

            switch (parseInt(level)) {
				case 1:
					allhp = allhp + 89;
					allmp = allmp + 56;
					allpv = allpv + 1;
					allstr = allstr + 13;
					alldex = alldex + 10;
					alliint = alliint + 12;
					allweight = allweight + 3410;
					break;
				case 2:
					allhp = allhp + 99;
					allmp = allmp + 58;
					allpv = allpv + 1;
					allstr = allstr + 13;
					alldex = alldex + 10;
					alliint = alliint + 12;
					allweight = allweight + 3430;
					break;
				case 3:
					allhp = allhp + 112;
					allmp = allmp + 62;
					allpv = allpv + 1;
					allstr = allstr + 14;
					alldex = alldex + 10;
					alliint = alliint + 13;
					allweight = allweight + 3480;
					break;
				case 4:
					allhp = allhp + 122;
					allmp = allmp + 64;
					allpv = allpv + 1;
					allstr = allstr + 14;
					alldex = alldex + 10;
					alliint = alliint + 13;
					allweight = allweight + 3500;
					break;
				case 5:
					allhp = allhp + 132;
					allmp = allmp + 66;
					allpv = allpv + 1;
					allstr = allstr + 14;
					alldex = alldex + 10;
					alliint = alliint + 13;
					allweight = allweight + 3520;
					break;
				case 6:
					allhp = allhp + 145;
					allmp = allmp + 70;
					allpv = allpv + 1;
					allstr = allstr + 15;
					alldex = alldex + 10;
					alliint = alliint + 14;
					allweight = allweight + 3570;
					break;
				case 7:
					allhp = allhp + 155;
					allmp = allmp + 72;
					allpv = allpv + 1;
					allstr = allstr + 15;
					alldex = alldex + 10;
					alliint = alliint + 14;
					allweight = allweight + 3590;
					break;
				case 8:
					allhp = allhp + 165;
					allmp = allmp + 74;
					allpv = allpv + 1;
					allstr = allstr + 15;
					alldex = alldex + 10;
					alliint = alliint + 14;
					allweight = allweight + 3610;
					break;
				case 9:
					allhp = allhp + 178;
					allmp = allmp + 78;
					allpv = allpv + 1;
					allstr = allstr + 16;
					alldex = alldex + 10;
					alliint = alliint + 15;
					allweight = allweight + 3660;
					break;
				case 10:
					allhp = allhp + 188;
					allmp = allmp + 80;
					allpv = allpv + 1;
					allstr = allstr + 16;
					alldex = alldex + 10;
					alliint = alliint + 15;
					allweight = allweight + 3680;
					break;
				case 11:
					allhp = allhp + 198;
					allmp = allmp + 82;
					allpv = allpv + 1;
					allstr = allstr + 16;
					alldex = alldex + 10;
					alliint = alliint + 15;
					allweight = allweight + 3700;
					break;
				case 12:
					allhp = allhp + 211;
					allmp = allmp + 86;
					allpv = allpv + 1;
					allstr = allstr + 17;
					alldex = alldex + 10;
					alliint = alliint + 16;
					allweight = allweight + 3750;
					break;
				case 13:
					allhp = allhp + 221;
					allmp = allmp + 88;
					allpv = allpv + 1;
					allstr = allstr + 17;
					alldex = alldex + 10;
					alliint = alliint + 16;
					allweight = allweight + 3770;
					break;
				case 14:
					allhp = allhp + 231;
					allmp = allmp + 90;
					allpv = allpv + 1;
					allstr = allstr + 17;
					alldex = alldex + 10;
					alliint = alliint + 16;
					allweight = allweight + 3790;
					break;
				case 15:
					allhp = allhp + 244;
					allmp = allmp + 94;
					allpv = allpv + 1;
					allstr = allstr + 18;
					alldex = alldex + 11;
					alliint = alliint + 17;
					allweight = allweight + 3840;
					break;
				case 16:
					allhp = allhp + 254;
					allmp = allmp + 96;
					allpv = allpv + 1;
					allstr = allstr + 18;
					alldex = alldex + 11;
					alliint = alliint + 17;
					allweight = allweight + 3860;
					break;
				case 17:
					allhp = allhp + 264;
					allmp = allmp + 98;
					allpv = allpv + 1;
					allstr = allstr + 18;
					alldex = alldex + 11;
					alliint = alliint + 17;
					allweight = allweight + 3880;
					break;
				case 18:
					allhp = allhp + 277;
					allmp = allmp + 102;
					allpv = allpv + 1;
					allstr = allstr + 19;
					alldex = alldex + 11;
					alliint = alliint + 18;
					allweight = allweight + 3930;
					break;
				case 19:
					allhp = allhp + 287;
					allmp = allmp + 104;
					allpv = allpv + 1;
					allstr = allstr + 19;
					alldex = alldex + 11;
					alliint = alliint + 18;
					allweight = allweight + 3950;
					break;
				case 20:
					allhp = allhp + 297;
					allmp = allmp + 106;
					allpv = allpv + 1;
					allstr = allstr + 19;
					alldex = alldex + 11;
					alliint = alliint + 18;
					allweight = allweight + 3970;
					break;
				case 21:
					allhp = allhp + 310;
					allmp = allmp + 110;
					allpv = allpv + 1;
					allstr = allstr + 20;
					alldex = alldex + 11;
					alliint = alliint + 19;
					allweight = allweight + 4020;
					break;
				case 22:
					allhp = allhp + 320;
					allmp = allmp + 112;
					allpv = allpv + 1;
					allstr = allstr + 20;
					alldex = alldex + 11;
					alliint = alliint + 19;
					allweight = allweight + 4040;
					break;
				case 23:
					allhp = allhp + 330;
					allmp = allmp + 114;
					allpv = allpv + 1;
					allstr = allstr + 20;
					alldex = alldex + 11;
					alliint = alliint + 19;
					allweight = allweight + 4060;
					break;
				case 24:
					allhp = allhp + 343;
					allmp = allmp + 118;
					allpv = allpv + 1;
					allstr = allstr + 21;
					alldex = alldex + 11;
					alliint = alliint + 20;
					allweight = allweight + 4110;
					break;
				case 25:
					allhp = allhp + 353;
					allmp = allmp + 120;
					allpv = allpv + 1;
					allstr = allstr + 21;
					alldex = alldex + 11;
					alliint = alliint + 20;
					allweight = allweight + 4130;
					break;
				case 26:
					allhp = allhp + 363;
					allmp = allmp + 122;
					allpv = allpv + 1;
					allstr = allstr + 21;
					alldex = alldex + 11;
					alliint = alliint + 20;
					allweight = allweight + 4150;
					break;
				case 27:
					allhp = allhp + 376;
					allmp = allmp + 126;
					allpv = allpv + 1;
					allstr = allstr + 22;
					alldex = alldex + 11;
					alliint = alliint + 21;
					allweight = allweight + 4200;
					break;
				case 28:
					allhp = allhp + 386;
					allmp = allmp + 128;
					allpv = allpv + 1;
					allstr = allstr + 22;
					alldex = alldex + 11;
					alliint = alliint + 21;
					allweight = allweight + 4220;
					break;
				case 29:
					allhp = allhp + 396;
					allmp = allmp + 130;
					allpv = allpv + 1;
					allstr = allstr + 22;
					alldex = alldex + 11;
					alliint = alliint + 21;
					allweight = allweight + 4240;
					break;
				case 30:
					allhp = allhp + 409;
					allmp = allmp + 134;
					allpv = allpv + 1;
					allstr = allstr + 23;
					alldex = alldex + 12;
					alliint = alliint + 22;
					allweight = allweight + 4290;
					break;
				case 31:
					allhp = allhp + 419;
					allmp = allmp + 136;
					allpv = allpv + 1;
					allstr = allstr + 23;
					alldex = alldex + 12;
					alliint = alliint + 22;
					allweight = allweight + 4310;
					break;
				case 32:
					allhp = allhp + 429;
					allmp = allmp + 138;
					allpv = allpv + 1;
					allstr = allstr + 23;
					alldex = alldex + 12;
					alliint = alliint + 22;
					allweight = allweight + 4330;
					break;
				case 33:
					allhp = allhp + 442;
					allmp = allmp + 142;
					allpv = allpv + 1;
					allstr = allstr + 24;
					alldex = alldex + 12;
					alliint = alliint + 23;
					allweight = allweight + 4380;
					break;
				case 34:
					allhp = allhp + 452;
					allmp = allmp + 144;
					allpv = allpv + 1;
					allstr = allstr + 24;
					alldex = alldex + 12;
					alliint = alliint + 23;
					allweight = allweight + 4400;
					break;
				case 35:
					allhp = allhp + 462;
					allmp = allmp + 146;
					allpv = allpv + 1;
					allstr = allstr + 24;
					alldex = alldex + 12;
					alliint = alliint + 23;
					allweight = allweight + 4420;
					break;
				case 36:
					allhp = allhp + 475;
					allmp = allmp + 150;
					allpv = allpv + 1;
					allstr = allstr + 25;
					alldex = alldex + 12;
					alliint = alliint + 24;
					allweight = allweight + 4470;
					break;
				case 37:
					allhp = allhp + 485;
					allmp = allmp + 152;
					allpv = allpv + 1;
					allstr = allstr + 25;
					alldex = alldex + 12;
					alliint = alliint + 24;
					allweight = allweight + 4490;
					break;
				case 38:
					allhp = allhp + 495;
					allmp = allmp + 154;
					allpv = allpv + 1;
					allstr = allstr + 25;
					alldex = alldex + 12;
					alliint = alliint + 24;
					allweight = allweight + 4510;
					break;
				case 39:
					allhp = allhp + 508;
					allmp = allmp + 158;
					allpv = allpv + 1;
					allstr = allstr + 26;
					alldex = alldex + 12;
					alliint = alliint + 25;
					allweight = allweight + 4560;
					break;
				case 40:
					allhp = allhp + 518;
					allmp = allmp + 160;
					allpv = allpv + 1;
					allstr = allstr + 26;
					alldex = alldex + 12;
					alliint = alliint + 25;
					allweight = allweight + 4580;
					break;
				case 41:
					allhp = allhp + 528;
					allmp = allmp + 162;
					allpv = allpv + 1;
					allstr = allstr + 26;
					alldex = alldex + 12;
					alliint = alliint + 25;
					allweight = allweight + 4600;
					break;
				case 42:
					allhp = allhp + 541;
					allmp = allmp + 166;
					allpv = allpv + 1;
					allstr = allstr + 27;
					alldex = alldex + 12;
					alliint = alliint + 26;
					allweight = allweight + 4650;
					break;
				case 43:
					allhp = allhp + 551;
					allmp = allmp + 168;
					allpv = allpv + 1;
					allstr = allstr + 27;
					alldex = alldex + 12;
					alliint = alliint + 26;
					allweight = allweight + 4670;
					break;
				case 44:
					allhp = allhp + 561;
					allmp = allmp + 170;
					allpv = allpv + 1;
					allstr = allstr + 27;
					alldex = alldex + 12;
					alliint = alliint + 26;
					allweight = allweight + 4690;
					break;
				case 45:
					allhp = allhp + 574;
					allmp = allmp + 174;
					allpv = allpv + 1;
					allstr = allstr + 28;
					alldex = alldex + 13;
					alliint = alliint + 27;
					allweight = allweight + 4740;
					break;
				case 46:
					allhp = allhp + 584;
					allmp = allmp + 176;
					allpv = allpv + 1;
					allstr = allstr + 28;
					alldex = alldex + 13;
					alliint = alliint + 27;
					allweight = allweight + 4760;
					break;
				case 47:
					allhp = allhp + 594;
					allmp = allmp + 178;
					allpv = allpv + 1;
					allstr = allstr + 28;
					alldex = alldex + 13;
					alliint = alliint + 27;
					allweight = allweight + 4780;
					break;
				case 48:
					allhp = allhp + 607;
					allmp = allmp + 182;
					allpv = allpv + 1;
					allstr = allstr + 29;
					alldex = alldex + 13;
					alliint = alliint + 28;
					allweight = allweight + 4830;
					break;
				case 49:
					allhp = allhp + 617;
					allmp = allmp + 184;
					allpv = allpv + 1;
					allstr = allstr + 29;
					alldex = alldex + 13;
					alliint = alliint + 28;
					allweight = allweight + 4850;
					break;
				case 50:
					allhp = allhp + 627;
					allmp = allmp + 186;
					allpv = allpv + 1;
					allstr = allstr + 29;
					alldex = alldex + 13;
					alliint = alliint + 28;
					allweight = allweight + 4870;
					break;
				case 51:
					allhp = allhp + 640;
					allmp = allmp + 190;
					allpv = allpv + 1;
					allstr = allstr + 30;
					alldex = alldex + 13;
					alliint = alliint + 29;
					allweight = allweight + 4920;
					break;
				case 52:
					allhp = allhp + 650;
					allmp = allmp + 192;
					allpv = allpv + 1;
					allstr = allstr + 30;
					alldex = alldex + 13;
					alliint = alliint + 29;
					allweight = allweight + 4940;
					break;
				case 53:
					allhp = allhp + 660;
					allmp = allmp + 194;
					allpv = allpv + 1;
					allstr = allstr + 30;
					alldex = alldex + 13;
					alliint = alliint + 29;
					allweight = allweight + 4960;
					break;
				case 54:
					allhp = allhp + 673;
					allmp = allmp + 198;
					allpv = allpv + 1;
					allstr = allstr + 31;
					alldex = alldex + 13;
					alliint = alliint + 30;
					allweight = allweight + 5010;
					break;
				case 55:
					allhp = allhp + 683;
					allmp = allmp + 200;
					allpv = allpv + 1;
					allstr = allstr + 31;
					alldex = alldex + 13;
					alliint = alliint + 30;
					allweight = allweight + 5030;
					break;
				case 56:
					allhp = allhp + 693;
					allmp = allmp + 202;
					allpv = allpv + 1;
					allstr = allstr + 31;
					alldex = alldex + 13;
					alliint = alliint + 30;
					allweight = allweight + 5050;
					break;
				case 57:
					allhp = allhp + 706;
					allmp = allmp + 206;
					allpv = allpv + 1;
					allstr = allstr + 32;
					alldex = alldex + 13;
					alliint = alliint + 31;
					allweight = allweight + 5100;
					break;
				case 58:
					allhp = allhp + 716;
					allmp = allmp + 208;
					allpv = allpv + 1;
					allstr = allstr + 32;
					alldex = alldex + 13;
					alliint = alliint + 31;
					allweight = allweight + 5120;
					break;
				case 59:
					allhp = allhp + 726;
					allmp = allmp + 210;
					allpv = allpv + 1;
					allstr = allstr + 32;
					alldex = alldex + 13;
					alliint = alliint + 31;
					allweight = allweight + 5140;
					break;
				case 60:
					allhp = allhp + 739;
					allmp = allmp + 214;
					allpv = allpv + 1;
					allstr = allstr + 33;
					alldex = alldex + 14;
					alliint = alliint + 32;
					allweight = allweight + 5190;
					break;
				case 61:
					allhp = allhp + 749;
					allmp = allmp + 216;
					allpv = allpv + 1;
					allstr = allstr + 33;
					alldex = alldex + 14;
					alliint = alliint + 32;
					allweight = allweight + 5210;
					break;
				case 62:
					allhp = allhp + 759;
					allmp = allmp + 218;
					allpv = allpv + 1;
					allstr = allstr + 33;
					alldex = alldex + 14;
					alliint = alliint + 32;
					allweight = allweight + 5230;
					break;
				case 63:
					allhp = allhp + 772;
					allmp = allmp + 222;
					allpv = allpv + 1;
					allstr = allstr + 34;
					alldex = alldex + 14;
					alliint = alliint + 33;
					allweight = allweight + 5280;
					break;
				case 64:
					allhp = allhp + 782;
					allmp = allmp + 224;
					allpv = allpv + 1;
					allstr = allstr + 34;
					alldex = alldex + 14;
					alliint = alliint + 33;
					allweight = allweight + 5300;
					break;
				case 65:
					allhp = allhp + 792;
					allmp = allmp + 226;
					allpv = allpv + 1;
					allstr = allstr + 34;
					alldex = alldex + 14;
					alliint = alliint + 33;
					allweight = allweight + 5320;
					break;
				case 66:
					allhp = allhp + 805;
					allmp = allmp + 230;
					allpv = allpv + 1;
					allstr = allstr + 35;
					alldex = alldex + 14;
					alliint = alliint + 34;
					allweight = allweight + 5370;
					break;
				case 67:
					allhp = allhp + 815;
					allmp = allmp + 232;
					allpv = allpv + 1;
					allstr = allstr + 35;
					alldex = alldex + 14;
					alliint = alliint + 34;
					allweight = allweight + 5390;
					break;
				case 68:
					allhp = allhp + 825;
					allmp = allmp + 234;
					allpv = allpv + 1;
					allstr = allstr + 35;
					alldex = alldex + 14;
					alliint = alliint + 34;
					allweight = allweight + 5410;
					break;
				case 69:
					allhp = allhp + 838;
					allmp = allmp + 238;
					allpv = allpv + 1;
					allstr = allstr + 36;
					alldex = alldex + 14;
					alliint = alliint + 35;
					allweight = allweight + 5460;
					break;
				case 70:
					allhp = allhp + 848;
					allmp = allmp + 240;
					allpv = allpv + 1;
					allstr = allstr + 36;
					alldex = alldex + 14;
					alliint = alliint + 35;
					allweight = allweight + 5480;
					break;
				case 71:
					allhp = allhp + 858;
					allmp = allmp + 242;
					allpv = allpv + 1;
					allstr = allstr + 36;
					alldex = alldex + 14;
					alliint = alliint + 35;
					allweight = allweight + 5500;
					break;
				case 72:
					allhp = allhp + 871;
					allmp = allmp + 246;
					allpv = allpv + 1;
					allstr = allstr + 37;
					alldex = alldex + 14;
					alliint = alliint + 36;
					allweight = allweight + 5550;
					break;
				case 73:
					allhp = allhp + 881;
					allmp = allmp + 248;
					allpv = allpv + 1;
					allstr = allstr + 37;
					alldex = alldex + 14;
					alliint = alliint + 36;
					allweight = allweight + 5570;
					break;
				case 74:
					allhp = allhp + 891;
					allmp = allmp + 250;
					allpv = allpv + 1;
					allstr = allstr + 37;
					alldex = alldex + 14;
					alliint = alliint + 36;
					allweight = allweight + 5590;
					break;
				case 75:
					allhp = allhp + 904;
					allmp = allmp + 254;
					allpv = allpv + 1;
					allstr = allstr + 38;
					alldex = alldex + 15;
					alliint = alliint + 37;
					allweight = allweight + 5640;
					break;
				case 76:
					allhp = allhp + 914;
					allmp = allmp + 256;
					allpv = allpv + 1;
					allstr = allstr + 38;
					alldex = alldex + 15;
					alliint = alliint + 37;
					allweight = allweight + 5660;
					break;
				case 77:
					allhp = allhp + 924;
					allmp = allmp + 258;
					allpv = allpv + 1;
					allstr = allstr + 38;
					alldex = alldex + 15;
					alliint = alliint + 37;
					allweight = allweight + 5680;
					break;
				case 78:
					allhp = allhp + 937;
					allmp = allmp + 262;
					allpv = allpv + 1;
					allstr = allstr + 39;
					alldex = alldex + 15;
					alliint = alliint + 38;
					allweight = allweight + 5730;
					break;
				case 79:
					allhp = allhp + 947;
					allmp = allmp + 264;
					allpv = allpv + 1;
					allstr = allstr + 39;
					alldex = alldex + 15;
					alliint = alliint + 38;
					allweight = allweight + 5750;
					break;
				case 80:
					allhp = allhp + 957;
					allmp = allmp + 266;
					allpv = allpv + 1;
					allstr = allstr + 39;
					alldex = alldex + 15;
					alliint = alliint + 38;
					allweight = allweight + 5770;
					break;
				case 81:
					allhp = allhp + 970;
					allmp = allmp + 270;
					allpv = allpv + 1;
					allstr = allstr + 40;
					alldex = alldex + 15;
					alliint = alliint + 39;
					allweight = allweight + 5820;
					break;
				case 82:
					allhp = allhp + 980;
					allmp = allmp + 272;
					allpv = allpv + 1;
					allstr = allstr + 40;
					alldex = alldex + 15;
					alliint = alliint + 39;
					allweight = allweight + 5840;
					break;
				case 83:
					allhp = allhp + 990;
					allmp = allmp + 274;
					allpv = allpv + 1;
					allstr = allstr + 40;
					alldex = alldex + 15;
					alliint = alliint + 39;
					allweight = allweight + 5860;
					break;
				case 84:
					allhp = allhp + 1003;
					allmp = allmp + 278;
					allpv = allpv + 1;
					allstr = allstr + 41;
					alldex = alldex + 15;
					alliint = alliint + 40;
					allweight = allweight + 5910;
					break;
				case 85:
					allhp = allhp + 1013;
					allmp = allmp + 280;
					allpv = allpv + 1;
					allstr = allstr + 41;
					alldex = alldex + 15;
					alliint = alliint + 40;
					allweight = allweight + 5930;
					break;
				case 86:
					allhp = allhp + 1023;
					allmp = allmp + 282;
					allpv = allpv + 1;
					allstr = allstr + 41;
					alldex = alldex + 15;
					alliint = alliint + 40;
					allweight = allweight + 5950;
					break;
				case 87:
					allhp = allhp + 1036;
					allmp = allmp + 286;
					allpv = allpv + 1;
					allstr = allstr + 42;
					alldex = alldex + 15;
					alliint = alliint + 41;
					allweight = allweight + 6000;
					break;
				case 88:
					allhp = allhp + 1046;
					allmp = allmp + 288;
					allpv = allpv + 1;
					allstr = allstr + 42;
					alldex = alldex + 15;
					alliint = alliint + 41;
					allweight = allweight + 6020;
					break;
				case 89:
					allhp = allhp + 1056;
					allmp = allmp + 290;
					allpv = allpv + 1;
					allstr = allstr + 42;
					alldex = alldex + 15;
					alliint = alliint + 41;
					allweight = allweight + 6040;
					break;
				case 90:
					allhp = allhp + 1069;
					allmp = allmp + 294;
					allpv = allpv + 1;
					allstr = allstr + 43;
					alldex = alldex + 16;
					alliint = alliint + 42;
					allweight = allweight + 6090;
					break;
				case 91:
					allhp = allhp + 1079;
					allmp = allmp + 296;
					allpv = allpv + 1;
					allstr = allstr + 43;
					alldex = alldex + 16;
					alliint = alliint + 42;
					allweight = allweight + 6110;
					break;
				case 92:
					allhp = allhp + 1089;
					allmp = allmp + 298;
					allpv = allpv + 1;
					allstr = allstr + 43;
					alldex = alldex + 16;
					alliint = alliint + 42;
					allweight = allweight + 6130;
					break;
				case 93:
					allhp = allhp + 1102;
					allmp = allmp + 302;
					allpv = allpv + 1;
					allstr = allstr + 44;
					alldex = alldex + 16;
					alliint = alliint + 43;
					allweight = allweight + 6180;
					break;
				case 94:
					allhp = allhp + 1112;
					allmp = allmp + 304;
					allpv = allpv + 1;
					allstr = allstr + 44;
					alldex = alldex + 16;
					alliint = alliint + 43;
					allweight = allweight + 6200;
					break;
				case 95:
					allhp = allhp + 1122;
					allmp = allmp + 306;
					allpv = allpv + 1;
					allstr = allstr + 44;
					alldex = alldex + 16;
					alliint = alliint + 43;
					allweight = allweight + 6220;
					break;
				case 96:
					allhp = allhp + 1135;
					allmp = allmp + 310;
					allpv = allpv + 1;
					allstr = allstr + 45;
					alldex = alldex + 16;
					alliint = alliint + 44;
					allweight = allweight + 6270;
					break;
				case 97:
					allhp = allhp + 1145;
					allmp = allmp + 312;
					allpv = allpv + 1;
					allstr = allstr + 45;
					alldex = alldex + 16;
					alliint = alliint + 44;
					allweight = allweight + 6290;
					break;
				case 98:
					allhp = allhp + 1155;
					allmp = allmp + 314;
					allpv = allpv + 1;
					allstr = allstr + 45;
					alldex = alldex + 16;
					alliint = alliint + 44;
					allweight = allweight + 6310;
					break;
				case 99:
					allhp = allhp + 1168;
					allmp = allmp + 318;
					allpv = allpv + 1;
					allstr = allstr + 46;
					alldex = alldex + 16;
					alliint = alliint + 45;
					allweight = allweight + 6360;
					break;
				case 100:
					allhp = allhp + 1178;
					allmp = allmp + 320;
					allpv = allpv + 1;
					allstr = allstr + 46;
					alldex = alldex + 16;
					alliint = alliint + 45;
					allweight = allweight + 6380;
					break;
				case 101:
					allhp = allhp + 1188;
					allmp = allmp + 332;
					allpv = allpv + 1;
					allstr = allstr + 46;
					alldex = alldex + 16;
					alliint = alliint + 45;
					allweight = allweight + 6800;
					break;
				case 102:
					allhp = allhp + 1201;
					allmp = allmp + 346;
					allpv = allpv + 1;
					allstr = allstr + 47;
					alldex = alldex + 16;
					alliint = alliint + 46;
					allweight = allweight + 7250;
					break;
				case 103:
					allhp = allhp + 1211;
					allmp = allmp + 358;
					allpv = allpv + 1;
					allstr = allstr + 47;
					alldex = alldex + 16;
					alliint = alliint + 46;
					allweight = allweight + 7670;
					break;
				case 104:
					allhp = allhp + 1221;
					allmp = allmp + 370;
					allpv = allpv + 1;
					allstr = allstr + 47;
					alldex = alldex + 16;
					alliint = alliint + 46;
					allweight = allweight + 8090;
					break;
				case 105:
					allhp = allhp + 1234;
					allmp = allmp + 384;
					allpv = allpv + 1;
					allstr = allstr + 48;
					alldex = alldex + 17;
					alliint = alliint + 47;
					allweight = allweight + 8540;
					break;
				case 106:
					allhp = allhp + 1244;
					allmp = allmp + 396;
					allpv = allpv + 1;
					allstr = allstr + 48;
					alldex = alldex + 17;
					alliint = alliint + 47;
					allweight = allweight + 8960;
					break;
				case 107:
					allhp = allhp + 1254;
					allmp = allmp + 408;
					allpv = allpv + 1;
					allstr = allstr + 48;
					alldex = alldex + 17;
					alliint = alliint + 47;
					allweight = allweight + 9380;
					break;
				case 108:
					allhp = allhp + 1267;
					allmp = allmp + 422;
					allpv = allpv + 1;
					allstr = allstr + 49;
					alldex = alldex + 17;
					alliint = alliint + 48;
					allweight = allweight + 9830;
					break;
				case 109:
					allhp = allhp + 1277;
					allmp = allmp + 434;
					allpv = allpv + 1;
					allstr = allstr + 49;
					alldex = alldex + 17;
					alliint = alliint + 48;
					allweight = allweight + 10250;
					break;
				case 110:
					allhp = allhp + 1287;
					allmp = allmp + 446;
					allpv = allpv + 1;
					allstr = allstr + 49;
					alldex = alldex + 17;
					alliint = alliint + 48;
					allweight = allweight + 10670;
					break;
				case 111:
					allhp = allhp + 1300;
					allmp = allmp + 460;
					allpv = allpv + 1;
					allstr = allstr + 50;
					alldex = alldex + 17;
					alliint = alliint + 49;
					allweight = allweight + 11120;
					break;
				case 112:
					allhp = allhp + 1310;
					allmp = allmp + 472;
					allpv = allpv + 1;
					allstr = allstr + 50;
					alldex = alldex + 17;
					alliint = alliint + 49;
					allweight = allweight + 11540;
					break;
				case 113:
					allhp = allhp + 1320;
					allmp = allmp + 484;
					allpv = allpv + 1;
					allstr = allstr + 50;
					alldex = alldex + 17;
					alliint = alliint + 49;
					allweight = allweight + 11960;
					break;
				case 114:
					allhp = allhp + 1333;
					allmp = allmp + 498;
					allpv = allpv + 1;
					allstr = allstr + 51;
					alldex = alldex + 17;
					alliint = alliint + 50;
					allweight = allweight + 12410;
					break;
				case 115:
					allhp = allhp + 1343;
					allmp = allmp + 510;
					allpv = allpv + 1;
					allstr = allstr + 51;
					alldex = alldex + 17;
					alliint = alliint + 50;
					allweight = allweight + 12830;
					break;
				case 116:
					allhp = allhp + 1353;
					allmp = allmp + 522;
					allpv = allpv + 1;
					allstr = allstr + 51;
					alldex = alldex + 17;
					alliint = alliint + 50;
					allweight = allweight + 13250;
					break;
				case 117:
					allhp = allhp + 1366;
					allmp = allmp + 536;
					allpv = allpv + 1;
					allstr = allstr + 52;
					alldex = alldex + 17;
					alliint = alliint + 51;
					allweight = allweight + 13700;
					break;
				case 118:
					allhp = allhp + 1376;
					allmp = allmp + 548;
					allpv = allpv + 1;
					allstr = allstr + 52;
					alldex = alldex + 17;
					alliint = alliint + 51;
					allweight = allweight + 14120;
					break;
				case 119:
					allhp = allhp + 1386;
					allmp = allmp + 560;
					allpv = allpv + 1;
					allstr = allstr + 52;
					alldex = alldex + 17;
					alliint = alliint + 51;
					allweight = allweight + 14540;
					break;
				case 120:
					allhp = allhp + 1399;
					allmp = allmp + 574;
					allpv = allpv + 1;
					allstr = allstr + 53;
					alldex = alldex + 18;
					alliint = alliint + 52;
					allweight = allweight + 14990;
					break;
				case 121:
					allhp = allhp + 1409;
					allmp = allmp + 586;
					allpv = allpv + 1;
					allstr = allstr + 53;
					alldex = alldex + 18;
					alliint = alliint + 52;
					allweight = allweight + 15410;
					break;
				case 122:
					allhp = allhp + 1419;
					allmp = allmp + 598;
					allpv = allpv + 1;
					allstr = allstr + 53;
					alldex = alldex + 18;
					alliint = alliint + 52;
					allweight = allweight + 15830;
					break;
				case 123:
					allhp = allhp + 1432;
					allmp = allmp + 612;
					allpv = allpv + 1;
					allstr = allstr + 54;
					alldex = alldex + 18;
					alliint = alliint + 53;
					allweight = allweight + 16280;
					break;
				case 124:
					allhp = allhp + 1442;
					allmp = allmp + 624;
					allpv = allpv + 1;
					allstr = allstr + 54;
					alldex = alldex + 18;
					alliint = alliint + 53;
					allweight = allweight + 16700;
					break;
				case 125:
					allhp = allhp + 1452;
					allmp = allmp + 636;
					allpv = allpv + 1;
					allstr = allstr + 54;
					alldex = alldex + 18;
					alliint = alliint + 53;
					allweight = allweight + 17120;
					break;
				case 126:
					allhp = allhp + 1465;
					allmp = allmp + 650;
					allpv = allpv + 1;
					allstr = allstr + 55;
					alldex = alldex + 18;
					alliint = alliint + 54;
					allweight = allweight + 17570;
					break;
				case 127:
					allhp = allhp + 1475;
					allmp = allmp + 662;
					allpv = allpv + 1;
					allstr = allstr + 55;
					alldex = alldex + 18;
					alliint = alliint + 54;
					allweight = allweight + 17990;
					break;
				case 128:
					allhp = allhp + 1485;
					allmp = allmp + 674;
					allpv = allpv + 1;
					allstr = allstr + 55;
					alldex = alldex + 18;
					alliint = alliint + 54;
					allweight = allweight + 18410;
					break;
				case 129:
					allhp = allhp + 1498;
					allmp = allmp + 688;
					allpv = allpv + 1;
					allstr = allstr + 56;
					alldex = alldex + 18;
					alliint = alliint + 55;
					allweight = allweight + 18860;
					break;
				case 130:
					allhp = allhp + 1508;
					allmp = allmp + 700;
					allpv = allpv + 1;
					allstr = allstr + 56;
					alldex = alldex + 18;
					alliint = alliint + 55;
					allweight = allweight + 19280;
					break;
				case 131:
					allhp = allhp + 1518;
					allmp = allmp + 712;
					allpv = allpv + 1;
					allstr = allstr + 56;
					alldex = alldex + 18;
					alliint = alliint + 55;
					allweight = allweight + 19700;
					break;
				case 132:
					allhp = allhp + 1531;
					allmp = allmp + 726;
					allpv = allpv + 1;
					allstr = allstr + 57;
					alldex = alldex + 18;
					alliint = alliint + 56;
					allweight = allweight + 20150;
					break;
				case 133:
					allhp = allhp + 1541;
					allmp = allmp + 738;
					allpv = allpv + 1;
					allstr = allstr + 57;
					alldex = alldex + 18;
					alliint = alliint + 56;
					allweight = allweight + 20570;
					break;
				case 134:
					allhp = allhp + 1551;
					allmp = allmp + 750;
					allpv = allpv + 1;
					allstr = allstr + 57;
					alldex = alldex + 18;
					alliint = alliint + 56;
					allweight = allweight + 20990;
					break;
				case 135:
					allhp = allhp + 1564;
					allmp = allmp + 764;
					allpv = allpv + 1;
					allstr = allstr + 58;
					alldex = alldex + 19;
					alliint = alliint + 57;
					allweight = allweight + 21440;
					break;
				case 136:
					allhp = allhp + 1574;
					allmp = allmp + 776;
					allpv = allpv + 1;
					allstr = allstr + 58;
					alldex = alldex + 19;
					alliint = alliint + 57;
					allweight = allweight + 21860;
					break;
				case 137:
					allhp = allhp + 1584;
					allmp = allmp + 788;
					allpv = allpv + 1;
					allstr = allstr + 58;
					alldex = alldex + 19;
					alliint = alliint + 57;
					allweight = allweight + 22280;
					break;
				case 138:
					allhp = allhp + 1597;
					allmp = allmp + 802;
					allpv = allpv + 1;
					allstr = allstr + 59;
					alldex = alldex + 19;
					alliint = alliint + 58;
					allweight = allweight + 22730;
					break;
				case 139:
					allhp = allhp + 1607;
					allmp = allmp + 814;
					allpv = allpv + 1;
					allstr = allstr + 59;
					alldex = alldex + 19;
					alliint = alliint + 58;
					allweight = allweight + 23150;
					break;
				case 140:
					allhp = allhp + 1617;
					allmp = allmp + 826;
					allpv = allpv + 1;
					allstr = allstr + 59;
					alldex = alldex + 19;
					alliint = alliint + 58;
					allweight = allweight + 23570;
					break;
				case 141:
					allhp = allhp + 1630;
					allmp = allmp + 840;
					allpv = allpv + 1;
					allstr = allstr + 60;
					alldex = alldex + 19;
					alliint = alliint + 59;
					allweight = allweight + 24020;
					break;
				case 142:
					allhp = allhp + 1640;
					allmp = allmp + 852;
					allpv = allpv + 1;
					allstr = allstr + 60;
					alldex = alldex + 19;
					alliint = alliint + 59;
					allweight = allweight + 24440;
					break;
				case 143:
					allhp = allhp + 1650;
					allmp = allmp + 864;
					allpv = allpv + 1;
					allstr = allstr + 60;
					alldex = alldex + 19;
					alliint = alliint + 59;
					allweight = allweight + 24860;
					break;
				case 144:
					allhp = allhp + 1663;
					allmp = allmp + 878;
					allpv = allpv + 1;
					allstr = allstr + 61;
					alldex = alldex + 19;
					alliint = alliint + 60;
					allweight = allweight + 25310;
					break;
				case 145:
					allhp = allhp + 1673;
					allmp = allmp + 890;
					allpv = allpv + 1;
					allstr = allstr + 61;
					alldex = alldex + 19;
					alliint = alliint + 60;
					allweight = allweight + 25730;
					break;
				case 146:
					allhp = allhp + 1683;
					allmp = allmp + 902;
					allpv = allpv + 1;
					allstr = allstr + 61;
					alldex = alldex + 19;
					alliint = alliint + 60;
					allweight = allweight + 26150;
					break;
				case 147:
					allhp = allhp + 1696;
					allmp = allmp + 916;
					allpv = allpv + 1;
					allstr = allstr + 62;
					alldex = alldex + 19;
					alliint = alliint + 61;
					allweight = allweight + 26600;
					break;
				case 148:
					allhp = allhp + 1706;
					allmp = allmp + 928;
					allpv = allpv + 1;
					allstr = allstr + 62;
					alldex = alldex + 19;
					alliint = alliint + 61;
					allweight = allweight + 27020;
					break;
				case 149:
					allhp = allhp + 1716;
					allmp = allmp + 940;
					allpv = allpv + 1;
					allstr = allstr + 62;
					alldex = alldex + 19;
					alliint = alliint + 61;
					allweight = allweight + 27440;
					break;
				case 150:
					allhp = allhp + 1729;
					allmp = allmp + 954;
					allpv = allpv + 1;
					allstr = allstr + 63;
					alldex = alldex + 20;
					alliint = alliint + 62;
					allweight = allweight + 27890;
					break;
				case 151:
					allhp = allhp + 1739;
					allmp = allmp + 966;
					allpv = allpv + 1;
					allstr = allstr + 63;
					alldex = alldex + 20;
					alliint = alliint + 62;
					allweight = allweight + 28310;
					break;
				case 152:
					allhp = allhp + 1749;
					allmp = allmp + 978;
					allpv = allpv + 1;
					allstr = allstr + 63;
					alldex = alldex + 20;
					alliint = alliint + 62;
					allweight = allweight + 28730;
					break;
				case 153:
					allhp = allhp + 1762;
					allmp = allmp + 992;
					allpv = allpv + 1;
					allstr = allstr + 64;
					alldex = alldex + 20;
					alliint = alliint + 63;
					allweight = allweight + 29180;
					break;
				case 154:
					allhp = allhp + 1772;
					allmp = allmp + 1004;
					allpv = allpv + 1;
					allstr = allstr + 64;
					alldex = alldex + 20;
					alliint = alliint + 63;
					allweight = allweight + 29600;
					break;
				case 155:
					allhp = allhp + 1782;
					allmp = allmp + 1016;
					allpv = allpv + 1;
					allstr = allstr + 64;
					alldex = alldex + 20;
					alliint = alliint + 63;
					allweight = allweight + 30020;
					break;
				case 156:
					allhp = allhp + 1795;
					allmp = allmp + 1030;
					allpv = allpv + 1;
					allstr = allstr + 65;
					alldex = alldex + 20;
					alliint = alliint + 64;
					allweight = allweight + 30470;
					break;
				case 157:
					allhp = allhp + 1805;
					allmp = allmp + 1042;
					allpv = allpv + 1;
					allstr = allstr + 65;
					alldex = alldex + 20;
					alliint = alliint + 64;
					allweight = allweight + 30890;
					break;
				case 158:
					allhp = allhp + 1815;
					allmp = allmp + 1054;
					allpv = allpv + 1;
					allstr = allstr + 65;
					alldex = alldex + 20;
					alliint = alliint + 64;
					allweight = allweight + 31310;
					break;
				case 159:
					allhp = allhp + 1828;
					allmp = allmp + 1068;
					allpv = allpv + 1;
					allstr = allstr + 66;
					alldex = alldex + 20;
					alliint = alliint + 65;
					allweight = allweight + 31760;
					break;
				case 160:
					allhp = allhp + 1838;
					allmp = allmp + 1080;
					allpv = allpv + 1;
					allstr = allstr + 66;
					alldex = alldex + 20;
					alliint = alliint + 65;
					allweight = allweight + 32180;
					break;
				case 161:
					allhp = allhp + 1848;
					allmp = allmp + 1092;
					allpv = allpv + 1;
					allstr = allstr + 66;
					alldex = alldex + 20;
					alliint = alliint + 65;
					allweight = allweight + 32600;
					break;
				case 162:
					allhp = allhp + 1861;
					allmp = allmp + 1106;
					allpv = allpv + 1;
					allstr = allstr + 67;
					alldex = alldex + 20;
					alliint = alliint + 66;
					allweight = allweight + 33050;
					break;
				case 163:
					allhp = allhp + 1871;
					allmp = allmp + 1118;
					allpv = allpv + 1;
					allstr = allstr + 67;
					alldex = alldex + 20;
					alliint = alliint + 66;
					allweight = allweight + 33470;
					break;
				case 164:
					allhp = allhp + 1881;
					allmp = allmp + 1130;
					allpv = allpv + 1;
					allstr = allstr + 67;
					alldex = alldex + 20;
					alliint = alliint + 66;
					allweight = allweight + 33890;
					break;
				case 165:
					allhp = allhp + 1894;
					allmp = allmp + 1144;
					allpv = allpv + 1;
					allstr = allstr + 68;
					alldex = alldex + 21;
					alliint = alliint + 67;
					allweight = allweight + 34340;
					break;
				case 166:
					allhp = allhp + 1904;
					allmp = allmp + 1156;
					allpv = allpv + 1;
					allstr = allstr + 68;
					alldex = alldex + 21;
					alliint = alliint + 67;
					allweight = allweight + 34760;
					break;
				case 167:
					allhp = allhp + 1914;
					allmp = allmp + 1168;
					allpv = allpv + 1;
					allstr = allstr + 68;
					alldex = alldex + 21;
					alliint = alliint + 67;
					allweight = allweight + 35180;
					break;
				case 168:
					allhp = allhp + 1927;
					allmp = allmp + 1182;
					allpv = allpv + 1;
					allstr = allstr + 69;
					alldex = alldex + 21;
					alliint = alliint + 68;
					allweight = allweight + 35630;
					break;
				case 169:
					allhp = allhp + 1937;
					allmp = allmp + 1194;
					allpv = allpv + 1;
					allstr = allstr + 69;
					alldex = alldex + 21;
					alliint = alliint + 68;
					allweight = allweight + 36050;
					break;
				case 170:
					allhp = allhp + 1947;
					allmp = allmp + 1206;
					allpv = allpv + 1;
					allstr = allstr + 69;
					alldex = alldex + 21;
					alliint = alliint + 68;
					allweight = allweight + 36470;
					break;
				case 171:
					allhp = allhp + 1960;
					allmp = allmp + 1220;
					allpv = allpv + 1;
					allstr = allstr + 70;
					alldex = alldex + 21;
					alliint = alliint + 69;
					allweight = allweight + 36920;
					break;
				case 172:
					allhp = allhp + 1970;
					allmp = allmp + 1232;
					allpv = allpv + 1;
					allstr = allstr + 70;
					alldex = alldex + 21;
					alliint = alliint + 69;
					allweight = allweight + 37340;
					break;
				case 173:
					allhp = allhp + 1980;
					allmp = allmp + 1244;
					allpv = allpv + 1;
					allstr = allstr + 70;
					alldex = alldex + 21;
					alliint = alliint + 69;
					allweight = allweight + 37760;
					break;
				case 174:
					allhp = allhp + 1993;
					allmp = allmp + 1258;
					allpv = allpv + 1;
					allstr = allstr + 71;
					alldex = alldex + 21;
					alliint = alliint + 70;
					allweight = allweight + 38210;
					break;
				case 175:
					allhp = allhp + 2003;
					allmp = allmp + 1270;
					allpv = allpv + 1;
					allstr = allstr + 71;
					alldex = alldex + 21;
					alliint = alliint + 70;
					allweight = allweight + 38630;
					break;
				case 176:
					allhp = allhp + 2013;
					allmp = allmp + 1282;
					allpv = allpv + 1;
					allstr = allstr + 71;
					alldex = alldex + 21;
					alliint = alliint + 70;
					allweight = allweight + 39050;
					break;
				case 177:
					allhp = allhp + 2026;
					allmp = allmp + 1296;
					allpv = allpv + 1;
					allstr = allstr + 72;
					alldex = alldex + 21;
					alliint = alliint + 71;
					allweight = allweight + 39500;
					break;
				case 178:
					allhp = allhp + 2036;
					allmp = allmp + 1308;
					allpv = allpv + 1;
					allstr = allstr + 72;
					alldex = alldex + 21;
					alliint = alliint + 71;
					allweight = allweight + 39920;
					break;
				case 179:
					allhp = allhp + 2046;
					allmp = allmp + 1320;
					allpv = allpv + 1;
					allstr = allstr + 72;
					alldex = alldex + 21;
					alliint = alliint + 71;
					allweight = allweight + 40340;
					break;
				case 180:
					allhp = allhp + 2059;
					allmp = allmp + 1334;
					allpv = allpv + 1;
					allstr = allstr + 73;
					alldex = alldex + 22;
					alliint = alliint + 72;
					allweight = allweight + 40790;
					break;
				case 181:
					allhp = allhp + 2069;
					allmp = allmp + 1346;
					allpv = allpv + 1;
					allstr = allstr + 73;
					alldex = alldex + 22;
					alliint = alliint + 72;
					allweight = allweight + 41210;
					break;
				case 182:
					allhp = allhp + 2079;
					allmp = allmp + 1358;
					allpv = allpv + 1;
					allstr = allstr + 73;
					alldex = alldex + 22;
					alliint = alliint + 72;
					allweight = allweight + 41630;
					break;
				case 183:
					allhp = allhp + 2092;
					allmp = allmp + 1372;
					allpv = allpv + 1;
					allstr = allstr + 74;
					alldex = alldex + 22;
					alliint = alliint + 73;
					allweight = allweight + 42080;
					break;
				case 184:
					allhp = allhp + 2102;
					allmp = allmp + 1384;
					allpv = allpv + 1;
					allstr = allstr + 74;
					alldex = alldex + 22;
					alliint = alliint + 73;
					allweight = allweight + 42500;
					break;
				case 185:
					allhp = allhp + 2112;
					allmp = allmp + 1396;
					allpv = allpv + 1;
					allstr = allstr + 74;
					alldex = alldex + 22;
					alliint = alliint + 73;
					allweight = allweight + 42920;
					break;
				case 186:
					allhp = allhp + 2125;
					allmp = allmp + 1410;
					allpv = allpv + 1;
					allstr = allstr + 75;
					alldex = alldex + 22;
					alliint = alliint + 74;
					allweight = allweight + 43370;
					break;
				case 187:
					allhp = allhp + 2135;
					allmp = allmp + 1422;
					allpv = allpv + 1;
					allstr = allstr + 75;
					alldex = alldex + 22;
					alliint = alliint + 74;
					allweight = allweight + 43790;
					break;
				case 188:
					allhp = allhp + 2145;
					allmp = allmp + 1434;
					allpv = allpv + 1;
					allstr = allstr + 75;
					alldex = alldex + 22;
					alliint = alliint + 74;
					allweight = allweight + 44210;
					break;
				case 189:
					allhp = allhp + 2158;
					allmp = allmp + 1448;
					allpv = allpv + 1;
					allstr = allstr + 76;
					alldex = alldex + 22;
					alliint = alliint + 75;
					allweight = allweight + 44660;
					break;
				case 190:
					allhp = allhp + 2168;
					allmp = allmp + 1460;
					allpv = allpv + 1;
					allstr = allstr + 76;
					alldex = alldex + 22;
					alliint = alliint + 75;
					allweight = allweight + 45080;
					break;
				case 191:
					allhp = allhp + 2178;
					allmp = allmp + 1472;
					allpv = allpv + 1;
					allstr = allstr + 76;
					alldex = alldex + 22;
					alliint = alliint + 75;
					allweight = allweight + 45500;
					break;
				case 192:
					allhp = allhp + 2191;
					allmp = allmp + 1486;
					allpv = allpv + 1;
					allstr = allstr + 77;
					alldex = alldex + 22;
					alliint = alliint + 76;
					allweight = allweight + 45950;
					break;
				case 193:
					allhp = allhp + 2201;
					allmp = allmp + 1498;
					allpv = allpv + 1;
					allstr = allstr + 77;
					alldex = alldex + 22;
					alliint = alliint + 76;
					allweight = allweight + 46370;
					break;
				case 194:
					allhp = allhp + 2211;
					allmp = allmp + 1510;
					allpv = allpv + 1;
					allstr = allstr + 77;
					alldex = alldex + 22;
					alliint = alliint + 76;
					allweight = allweight + 46790;
					break;
				case 195:
					allhp = allhp + 2224;
					allmp = allmp + 1524;
					allpv = allpv + 1;
					allstr = allstr + 78;
					alldex = alldex + 23;
					alliint = alliint + 77;
					allweight = allweight + 47240;
					break;
				case 196:
					allhp = allhp + 2234;
					allmp = allmp + 1536;
					allpv = allpv + 1;
					allstr = allstr + 78;
					alldex = alldex + 23;
					alliint = alliint + 77;
					allweight = allweight + 47660;
					break;
				case 197:
					allhp = allhp + 2244;
					allmp = allmp + 1548;
					allpv = allpv + 1;
					allstr = allstr + 78;
					alldex = alldex + 23;
					alliint = alliint + 77;
					allweight = allweight + 48080;
					break;
				case 198:
					allhp = allhp + 2257;
					allmp = allmp + 1562;
					allpv = allpv + 1;
					allstr = allstr + 79;
					alldex = alldex + 23;
					alliint = alliint + 78;
					allweight = allweight + 48530;
					break;
				case 199:
					allhp = allhp + 2267;
					allmp = allmp + 1574;
					allpv = allpv + 1;
					allstr = allstr + 79;
					alldex = alldex + 23;
					alliint = alliint + 78;
					allweight = allweight + 48950;
					break;
				case 200:
					allhp = allhp + 2277;
					allmp = allmp + 1586;
					allpv = allpv + 1;
					allstr = allstr + 79;
					alldex = alldex + 23;
					alliint = alliint + 78;
					allweight = allweight + 49370;
					break;
				case 201:
					allhp = allhp + 2290;
					allmp = allmp + 1600;
					allpv = allpv + 1;
					allstr = allstr + 80;
					alldex = alldex + 23;
					alliint = alliint + 79;
					allweight = allweight + 49820;
					break;
				case 202:
					allhp = allhp + 2300;
					allmp = allmp + 1612;
					allpv = allpv + 1;
					allstr = allstr + 80;
					alldex = alldex + 23;
					alliint = alliint + 79;
					allweight = allweight + 50240;
					break;
				case 203:
					allhp = allhp + 2310;
					allmp = allmp + 1624;
					allpv = allpv + 1;
					allstr = allstr + 80;
					alldex = alldex + 23;
					alliint = alliint + 79;
					allweight = allweight + 50660;
					break;
				case 204:
					allhp = allhp + 2323;
					allmp = allmp + 1638;
					allpv = allpv + 1;
					allstr = allstr + 81;
					alldex = alldex + 23;
					alliint = alliint + 80;
					allweight = allweight + 51110;
					break;
				case 205:
					allhp = allhp + 2333;
					allmp = allmp + 1650;
					allpv = allpv + 1;
					allstr = allstr + 81;
					alldex = alldex + 23;
					alliint = alliint + 80;
					allweight = allweight + 51530;
					break;
				case 206:
					allhp = allhp + 2343;
					allmp = allmp + 1662;
					allpv = allpv + 1;
					allstr = allstr + 81;
					alldex = alldex + 23;
					alliint = alliint + 80;
					allweight = allweight + 51950;
					break;
				case 207:
					allhp = allhp + 2356;
					allmp = allmp + 1676;
					allpv = allpv + 1;
					allstr = allstr + 82;
					alldex = alldex + 23;
					alliint = alliint + 81;
					allweight = allweight + 52400;
					break;
				case 208:
					allhp = allhp + 2366;
					allmp = allmp + 1688;
					allpv = allpv + 1;
					allstr = allstr + 82;
					alldex = alldex + 23;
					alliint = alliint + 81;
					allweight = allweight + 52820;
					break;
				case 209:
					allhp = allhp + 2376;
					allmp = allmp + 1700;
					allpv = allpv + 1;
					allstr = allstr + 82;
					alldex = alldex + 23;
					alliint = alliint + 81;
					allweight = allweight + 53240;
					break;
				case 210:
					allhp = allhp + 2389;
					allmp = allmp + 1714;
					allpv = allpv + 1;
					allstr = allstr + 83;
					alldex = alldex + 24;
					alliint = alliint + 82;
					allweight = allweight + 53690;
					break;
				case 211:
					allhp = allhp + 2399;
					allmp = allmp + 1726;
					allpv = allpv + 1;
					allstr = allstr + 83;
					alldex = alldex + 24;
					alliint = alliint + 82;
					allweight = allweight + 54110;
					break;
				case 212:
					allhp = allhp + 2409;
					allmp = allmp + 1738;
					allpv = allpv + 1;
					allstr = allstr + 83;
					alldex = alldex + 24;
					alliint = alliint + 82;
					allweight = allweight + 54530;
					break;
				case 213:
					allhp = allhp + 2422;
					allmp = allmp + 1752;
					allpv = allpv + 1;
					allstr = allstr + 84;
					alldex = alldex + 24;
					alliint = alliint + 83;
					allweight = allweight + 54980;
					break;
				case 214:
					allhp = allhp + 2432;
					allmp = allmp + 1764;
					allpv = allpv + 1;
					allstr = allstr + 84;
					alldex = alldex + 24;
					alliint = alliint + 83;
					allweight = allweight + 55400;
					break;
				case 215:
					allhp = allhp + 2442;
					allmp = allmp + 1776;
					allpv = allpv + 1;
					allstr = allstr + 84;
					alldex = alldex + 24;
					alliint = alliint + 83;
					allweight = allweight + 55820;
					break;
				case 216:
					allhp = allhp + 2455;
					allmp = allmp + 1790;
					allpv = allpv + 1;
					allstr = allstr + 85;
					alldex = alldex + 24;
					alliint = alliint + 84;
					allweight = allweight + 56270;
					break;
				case 217:
					allhp = allhp + 2465;
					allmp = allmp + 1802;
					allpv = allpv + 1;
					allstr = allstr + 85;
					alldex = alldex + 24;
					alliint = alliint + 84;
					allweight = allweight + 56690;
					break;
				case 218:
					allhp = allhp + 2475;
					allmp = allmp + 1814;
					allpv = allpv + 1;
					allstr = allstr + 85;
					alldex = alldex + 24;
					alliint = alliint + 84;
					allweight = allweight + 57110;
					break;
				case 219:
					allhp = allhp + 2488;
					allmp = allmp + 1828;
					allpv = allpv + 1;
					allstr = allstr + 86;
					alldex = alldex + 24;
					alliint = alliint + 85;
					allweight = allweight + 57560;
					break;
				case 220:
					allhp = allhp + 2498;
					allmp = allmp + 1840;
					allpv = allpv + 1;
					allstr = allstr + 86;
					alldex = alldex + 24;
					alliint = alliint + 85;
					allweight = allweight + 57980;
					break;
				case 221:
					allhp = allhp + 2508;
					allmp = allmp + 1852;
					allpv = allpv + 1;
					allstr = allstr + 86;
					alldex = alldex + 24;
					alliint = alliint + 85;
					allweight = allweight + 58400;
					break;
				case 222:
					allhp = allhp + 2521;
					allmp = allmp + 1866;
					allpv = allpv + 1;
					allstr = allstr + 87;
					alldex = alldex + 24;
					alliint = alliint + 86;
					allweight = allweight + 58850;
					break;
				case 223:
					allhp = allhp + 2531;
					allmp = allmp + 1878;
					allpv = allpv + 1;
					allstr = allstr + 87;
					alldex = alldex + 24;
					alliint = alliint + 86;
					allweight = allweight + 59270;
					break;
				case 224:
					allhp = allhp + 2541;
					allmp = allmp + 1890;
					allpv = allpv + 1;
					allstr = allstr + 87;
					alldex = alldex + 24;
					alliint = alliint + 86;
					allweight = allweight + 59690;
					break;
				case 225:
					allhp = allhp + 2554;
					allmp = allmp + 1904;
					allpv = allpv + 1;
					allstr = allstr + 88;
					alldex = alldex + 25;
					alliint = alliint + 87;
					allweight = allweight + 60140;
					break;
				case 226:
					allhp = allhp + 2564;
					allmp = allmp + 1916;
					allpv = allpv + 1;
					allstr = allstr + 88;
					alldex = alldex + 25;
					alliint = alliint + 87;
					allweight = allweight + 60560;
					break;
				case 227:
					allhp = allhp + 2574;
					allmp = allmp + 1928;
					allpv = allpv + 1;
					allstr = allstr + 88;
					alldex = alldex + 25;
					alliint = alliint + 87;
					allweight = allweight + 60980;
					break;
				case 228:
					allhp = allhp + 2587;
					allmp = allmp + 1942;
					allpv = allpv + 1;
					allstr = allstr + 89;
					alldex = alldex + 25;
					alliint = alliint + 88;
					allweight = allweight + 61430;
					break;
				case 229:
					allhp = allhp + 2597;
					allmp = allmp + 1954;
					allpv = allpv + 1;
					allstr = allstr + 89;
					alldex = alldex + 25;
					alliint = alliint + 88;
					allweight = allweight + 61850;
					break;
				case 230:
					allhp = allhp + 2607;
					allmp = allmp + 1966;
					allpv = allpv + 1;
					allstr = allstr + 89;
					alldex = alldex + 25;
					alliint = alliint + 88;
					allweight = allweight + 62270;
					break;
				case 231:
					allhp = allhp + 2620;
					allmp = allmp + 1980;
					allpv = allpv + 1;
					allstr = allstr + 90;
					alldex = alldex + 25;
					alliint = alliint + 89;
					allweight = allweight + 62720;
					break;
				case 232:
					allhp = allhp + 2630;
					allmp = allmp + 1992;
					allpv = allpv + 1;
					allstr = allstr + 90;
					alldex = alldex + 25;
					alliint = alliint + 89;
					allweight = allweight + 63140;
					break;
				case 233:
					allhp = allhp + 2640;
					allmp = allmp + 2004;
					allpv = allpv + 1;
					allstr = allstr + 90;
					alldex = alldex + 25;
					alliint = alliint + 89;
					allweight = allweight + 63560;
					break;
				case 234:
					allhp = allhp + 2653;
					allmp = allmp + 2018;
					allpv = allpv + 1;
					allstr = allstr + 91;
					alldex = alldex + 25;
					alliint = alliint + 90;
					allweight = allweight + 64010;
					break;
				case 235:
					allhp = allhp + 2663;
					allmp = allmp + 2030;
					allpv = allpv + 1;
					allstr = allstr + 91;
					alldex = alldex + 25;
					alliint = alliint + 90;
					allweight = allweight + 64430;
					break;
				case 236:
					allhp = allhp + 2673;
					allmp = allmp + 2042;
					allpv = allpv + 1;
					allstr = allstr + 91;
					alldex = alldex + 25;
					alliint = alliint + 90;
					allweight = allweight + 64850;
					break;
				case 237:
					allhp = allhp + 2686;
					allmp = allmp + 2056;
					allpv = allpv + 1;
					allstr = allstr + 92;
					alldex = alldex + 25;
					alliint = alliint + 91;
					allweight = allweight + 65300;
					break;
				case 238:
					allhp = allhp + 2696;
					allmp = allmp + 2068;
					allpv = allpv + 1;
					allstr = allstr + 92;
					alldex = alldex + 25;
					alliint = alliint + 91;
					allweight = allweight + 65720;
					break;
				case 239:
					allhp = allhp + 2706;
					allmp = allmp + 2080;
					allpv = allpv + 1;
					allstr = allstr + 92;
					alldex = alldex + 25;
					alliint = alliint + 91;
					allweight = allweight + 66140;
					break;
				case 240:
					allhp = allhp + 2719;
					allmp = allmp + 2094;
					allpv = allpv + 1;
					allstr = allstr + 93;
					alldex = alldex + 26;
					alliint = alliint + 92;
					allweight = allweight + 66590;
					break;
				case 241:
					allhp = allhp + 2729;
					allmp = allmp + 2106;
					allpv = allpv + 1;
					allstr = allstr + 93;
					alldex = alldex + 26;
					alliint = alliint + 92;
					allweight = allweight + 67010;
					break;
				case 242:
					allhp = allhp + 2739;
					allmp = allmp + 2118;
					allpv = allpv + 1;
					allstr = allstr + 93;
					alldex = alldex + 26;
					alliint = alliint + 92;
					allweight = allweight + 67430;
					break;
				case 243:
					allhp = allhp + 2752;
					allmp = allmp + 2132;
					allpv = allpv + 1;
					allstr = allstr + 94;
					alldex = alldex + 26;
					alliint = alliint + 93;
					allweight = allweight + 67880;
					break;
				case 244:
					allhp = allhp + 2762;
					allmp = allmp + 2144;
					allpv = allpv + 1;
					allstr = allstr + 94;
					alldex = alldex + 26;
					alliint = alliint + 93;
					allweight = allweight + 68300;
					break;
				case 245:
					allhp = allhp + 2772;
					allmp = allmp + 2156;
					allpv = allpv + 1;
					allstr = allstr + 94;
					alldex = alldex + 26;
					alliint = alliint + 93;
					allweight = allweight + 68720;
					break;
				case 246:
					allhp = allhp + 2785;
					allmp = allmp + 2170;
					allpv = allpv + 1;
					allstr = allstr + 95;
					alldex = alldex + 26;
					alliint = alliint + 94;
					allweight = allweight + 69170;
					break;
				case 247:
					allhp = allhp + 2795;
					allmp = allmp + 2182;
					allpv = allpv + 1;
					allstr = allstr + 95;
					alldex = alldex + 26;
					alliint = alliint + 94;
					allweight = allweight + 69590;
					break;
				case 248:
					allhp = allhp + 2805;
					allmp = allmp + 2194;
					allpv = allpv + 1;
					allstr = allstr + 95;
					alldex = alldex + 26;
					alliint = alliint + 94;
					allweight = allweight + 70010;
					break;
				case 249:
					allhp = allhp + 2818;
					allmp = allmp + 2208;
					allpv = allpv + 1;
					allstr = allstr + 96;
					alldex = alldex + 26;
					alliint = alliint + 95;
					allweight = allweight + 70460;
					break;
				case 250:
					allhp = allhp + 2828;
					allmp = allmp + 2220;
					allpv = allpv + 1;
					allstr = allstr + 96;
					alldex = alldex + 26;
					alliint = alliint + 95;
					allweight = allweight + 70880;
					break;
                default:
                    alert("Level must be 1-250");
            }
        }

        if (iclass === 4) {
            allhp = allhp + allstr * 3;
            allweight = allweight + allstr * 30;
            allmp = allmp + alliint * 3;

            if (alldex % 5 == 0) {
                allpv = allpv + (alldex / 5);
            }

            switch (parseInt(level)) {
				case 1:
					allhp = allhp + 89;
					allmp = allmp + 56;
					allpv = allpv + 1;
					allstr = allstr + 13;
					alldex = alldex + 10;
					alliint = alliint + 12;
					allweight = allweight + 3410;
					break;
				case 2:
					allhp = allhp + 99;
					allmp = allmp + 58;
					allpv = allpv + 1;
					allstr = allstr + 13;
					alldex = alldex + 10;
					alliint = alliint + 12;
					allweight = allweight + 3430;
					break;
				case 3:
					allhp = allhp + 112;
					allmp = allmp + 62;
					allpv = allpv + 1;
					allstr = allstr + 14;
					alldex = alldex + 10;
					alliint = alliint + 13;
					allweight = allweight + 3480;
					break;
				case 4:
					allhp = allhp + 122;
					allmp = allmp + 64;
					allpv = allpv + 1;
					allstr = allstr + 14;
					alldex = alldex + 10;
					alliint = alliint + 13;
					allweight = allweight + 3500;
					break;
				case 5:
					allhp = allhp + 132;
					allmp = allmp + 66;
					allpv = allpv + 1;
					allstr = allstr + 14;
					alldex = alldex + 10;
					alliint = alliint + 13;
					allweight = allweight + 3520;
					break;
				case 6:
					allhp = allhp + 145;
					allmp = allmp + 70;
					allpv = allpv + 1;
					allstr = allstr + 15;
					alldex = alldex + 10;
					alliint = alliint + 14;
					allweight = allweight + 3570;
					break;
				case 7:
					allhp = allhp + 155;
					allmp = allmp + 72;
					allpv = allpv + 1;
					allstr = allstr + 15;
					alldex = alldex + 10;
					alliint = alliint + 14;
					allweight = allweight + 3590;
					break;
				case 8:
					allhp = allhp + 165;
					allmp = allmp + 74;
					allpv = allpv + 1;
					allstr = allstr + 15;
					alldex = alldex + 10;
					alliint = alliint + 14;
					allweight = allweight + 3610;
					break;
				case 9:
					allhp = allhp + 178;
					allmp = allmp + 78;
					allpv = allpv + 1;
					allstr = allstr + 16;
					alldex = alldex + 10;
					alliint = alliint + 15;
					allweight = allweight + 3660;
					break;
				case 10:
					allhp = allhp + 188;
					allmp = allmp + 80;
					allpv = allpv + 1;
					allstr = allstr + 16;
					alldex = alldex + 10;
					alliint = alliint + 15;
					allweight = allweight + 3680;
					break;
				case 11:
					allhp = allhp + 198;
					allmp = allmp + 82;
					allpv = allpv + 1;
					allstr = allstr + 16;
					alldex = alldex + 10;
					alliint = alliint + 15;
					allweight = allweight + 3700;
					break;
				case 12:
					allhp = allhp + 211;
					allmp = allmp + 86;
					allpv = allpv + 1;
					allstr = allstr + 17;
					alldex = alldex + 10;
					alliint = alliint + 16;
					allweight = allweight + 3750;
					break;
				case 13:
					allhp = allhp + 221;
					allmp = allmp + 88;
					allpv = allpv + 1;
					allstr = allstr + 17;
					alldex = alldex + 10;
					alliint = alliint + 16;
					allweight = allweight + 3770;
					break;
				case 14:
					allhp = allhp + 231;
					allmp = allmp + 90;
					allpv = allpv + 1;
					allstr = allstr + 17;
					alldex = alldex + 10;
					alliint = alliint + 16;
					allweight = allweight + 3790;
					break;
				case 15:
					allhp = allhp + 244;
					allmp = allmp + 94;
					allpv = allpv + 1;
					allstr = allstr + 18;
					alldex = alldex + 11;
					alliint = alliint + 17;
					allweight = allweight + 3840;
					break;
				case 16:
					allhp = allhp + 254;
					allmp = allmp + 96;
					allpv = allpv + 1;
					allstr = allstr + 18;
					alldex = alldex + 11;
					alliint = alliint + 17;
					allweight = allweight + 3860;
					break;
				case 17:
					allhp = allhp + 264;
					allmp = allmp + 98;
					allpv = allpv + 1;
					allstr = allstr + 18;
					alldex = alldex + 11;
					alliint = alliint + 17;
					allweight = allweight + 3880;
					break;
				case 18:
					allhp = allhp + 277;
					allmp = allmp + 102;
					allpv = allpv + 1;
					allstr = allstr + 19;
					alldex = alldex + 11;
					alliint = alliint + 18;
					allweight = allweight + 3930;
					break;
				case 19:
					allhp = allhp + 287;
					allmp = allmp + 104;
					allpv = allpv + 1;
					allstr = allstr + 19;
					alldex = alldex + 11;
					alliint = alliint + 18;
					allweight = allweight + 3950;
					break;
				case 20:
					allhp = allhp + 297;
					allmp = allmp + 106;
					allpv = allpv + 1;
					allstr = allstr + 19;
					alldex = alldex + 11;
					alliint = alliint + 18;
					allweight = allweight + 3970;
					break;
				case 21:
					allhp = allhp + 310;
					allmp = allmp + 110;
					allpv = allpv + 1;
					allstr = allstr + 20;
					alldex = alldex + 11;
					alliint = alliint + 19;
					allweight = allweight + 4020;
					break;
				case 22:
					allhp = allhp + 320;
					allmp = allmp + 112;
					allpv = allpv + 1;
					allstr = allstr + 20;
					alldex = alldex + 11;
					alliint = alliint + 19;
					allweight = allweight + 4040;
					break;
				case 23:
					allhp = allhp + 330;
					allmp = allmp + 114;
					allpv = allpv + 1;
					allstr = allstr + 20;
					alldex = alldex + 11;
					alliint = alliint + 19;
					allweight = allweight + 4060;
					break;
				case 24:
					allhp = allhp + 343;
					allmp = allmp + 118;
					allpv = allpv + 1;
					allstr = allstr + 21;
					alldex = alldex + 11;
					alliint = alliint + 20;
					allweight = allweight + 4110;
					break;
				case 25:
					allhp = allhp + 353;
					allmp = allmp + 120;
					allpv = allpv + 1;
					allstr = allstr + 21;
					alldex = alldex + 11;
					alliint = alliint + 20;
					allweight = allweight + 4130;
					break;
				case 26:
					allhp = allhp + 363;
					allmp = allmp + 122;
					allpv = allpv + 1;
					allstr = allstr + 21;
					alldex = alldex + 11;
					alliint = alliint + 20;
					allweight = allweight + 4150;
					break;
				case 27:
					allhp = allhp + 376;
					allmp = allmp + 126;
					allpv = allpv + 1;
					allstr = allstr + 22;
					alldex = alldex + 11;
					alliint = alliint + 21;
					allweight = allweight + 4200;
					break;
				case 28:
					allhp = allhp + 386;
					allmp = allmp + 128;
					allpv = allpv + 1;
					allstr = allstr + 22;
					alldex = alldex + 11;
					alliint = alliint + 21;
					allweight = allweight + 4220;
					break;
				case 29:
					allhp = allhp + 396;
					allmp = allmp + 130;
					allpv = allpv + 1;
					allstr = allstr + 22;
					alldex = alldex + 11;
					alliint = alliint + 21;
					allweight = allweight + 4240;
					break;
				case 30:
					allhp = allhp + 409;
					allmp = allmp + 134;
					allpv = allpv + 1;
					allstr = allstr + 23;
					alldex = alldex + 12;
					alliint = alliint + 22;
					allweight = allweight + 4290;
					break;
				case 31:
					allhp = allhp + 419;
					allmp = allmp + 136;
					allpv = allpv + 1;
					allstr = allstr + 23;
					alldex = alldex + 12;
					alliint = alliint + 22;
					allweight = allweight + 4310;
					break;
				case 32:
					allhp = allhp + 429;
					allmp = allmp + 138;
					allpv = allpv + 1;
					allstr = allstr + 23;
					alldex = alldex + 12;
					alliint = alliint + 22;
					allweight = allweight + 4330;
					break;
				case 33:
					allhp = allhp + 442;
					allmp = allmp + 142;
					allpv = allpv + 1;
					allstr = allstr + 24;
					alldex = alldex + 12;
					alliint = alliint + 23;
					allweight = allweight + 4380;
					break;
				case 34:
					allhp = allhp + 452;
					allmp = allmp + 144;
					allpv = allpv + 1;
					allstr = allstr + 24;
					alldex = alldex + 12;
					alliint = alliint + 23;
					allweight = allweight + 4400;
					break;
				case 35:
					allhp = allhp + 462;
					allmp = allmp + 146;
					allpv = allpv + 1;
					allstr = allstr + 24;
					alldex = alldex + 12;
					alliint = alliint + 23;
					allweight = allweight + 4420;
					break;
				case 36:
					allhp = allhp + 475;
					allmp = allmp + 150;
					allpv = allpv + 1;
					allstr = allstr + 25;
					alldex = alldex + 12;
					alliint = alliint + 24;
					allweight = allweight + 4470;
					break;
				case 37:
					allhp = allhp + 485;
					allmp = allmp + 152;
					allpv = allpv + 1;
					allstr = allstr + 25;
					alldex = alldex + 12;
					alliint = alliint + 24;
					allweight = allweight + 4490;
					break;
				case 38:
					allhp = allhp + 495;
					allmp = allmp + 154;
					allpv = allpv + 1;
					allstr = allstr + 25;
					alldex = alldex + 12;
					alliint = alliint + 24;
					allweight = allweight + 4510;
					break;
				case 39:
					allhp = allhp + 508;
					allmp = allmp + 158;
					allpv = allpv + 1;
					allstr = allstr + 26;
					alldex = alldex + 12;
					alliint = alliint + 25;
					allweight = allweight + 4560;
					break;
				case 40:
					allhp = allhp + 518;
					allmp = allmp + 160;
					allpv = allpv + 1;
					allstr = allstr + 26;
					alldex = alldex + 12;
					alliint = alliint + 25;
					allweight = allweight + 4580;
					break;
				case 41:
					allhp = allhp + 528;
					allmp = allmp + 162;
					allpv = allpv + 1;
					allstr = allstr + 26;
					alldex = alldex + 12;
					alliint = alliint + 25;
					allweight = allweight + 4600;
					break;
				case 42:
					allhp = allhp + 541;
					allmp = allmp + 166;
					allpv = allpv + 1;
					allstr = allstr + 27;
					alldex = alldex + 12;
					alliint = alliint + 26;
					allweight = allweight + 4650;
					break;
				case 43:
					allhp = allhp + 551;
					allmp = allmp + 168;
					allpv = allpv + 1;
					allstr = allstr + 27;
					alldex = alldex + 12;
					alliint = alliint + 26;
					allweight = allweight + 4670;
					break;
				case 44:
					allhp = allhp + 561;
					allmp = allmp + 170;
					allpv = allpv + 1;
					allstr = allstr + 27;
					alldex = alldex + 12;
					alliint = alliint + 26;
					allweight = allweight + 4690;
					break;
				case 45:
					allhp = allhp + 574;
					allmp = allmp + 174;
					allpv = allpv + 1;
					allstr = allstr + 28;
					alldex = alldex + 13;
					alliint = alliint + 27;
					allweight = allweight + 4740;
					break;
				case 46:
					allhp = allhp + 584;
					allmp = allmp + 176;
					allpv = allpv + 1;
					allstr = allstr + 28;
					alldex = alldex + 13;
					alliint = alliint + 27;
					allweight = allweight + 4760;
					break;
				case 47:
					allhp = allhp + 594;
					allmp = allmp + 178;
					allpv = allpv + 1;
					allstr = allstr + 28;
					alldex = alldex + 13;
					alliint = alliint + 27;
					allweight = allweight + 4780;
					break;
				case 48:
					allhp = allhp + 607;
					allmp = allmp + 182;
					allpv = allpv + 1;
					allstr = allstr + 29;
					alldex = alldex + 13;
					alliint = alliint + 28;
					allweight = allweight + 4830;
					break;
				case 49:
					allhp = allhp + 617;
					allmp = allmp + 184;
					allpv = allpv + 1;
					allstr = allstr + 29;
					alldex = alldex + 13;
					alliint = alliint + 28;
					allweight = allweight + 4850;
					break;
				case 50:
					allhp = allhp + 627;
					allmp = allmp + 186;
					allpv = allpv + 1;
					allstr = allstr + 29;
					alldex = alldex + 13;
					alliint = alliint + 28;
					allweight = allweight + 4870;
					break;
				case 51:
					allhp = allhp + 640;
					allmp = allmp + 190;
					allpv = allpv + 1;
					allstr = allstr + 30;
					alldex = alldex + 13;
					alliint = alliint + 29;
					allweight = allweight + 4920;
					break;
				case 52:
					allhp = allhp + 650;
					allmp = allmp + 192;
					allpv = allpv + 1;
					allstr = allstr + 30;
					alldex = alldex + 13;
					alliint = alliint + 29;
					allweight = allweight + 4940;
					break;
				case 53:
					allhp = allhp + 660;
					allmp = allmp + 194;
					allpv = allpv + 1;
					allstr = allstr + 30;
					alldex = alldex + 13;
					alliint = alliint + 29;
					allweight = allweight + 4960;
					break;
				case 54:
					allhp = allhp + 673;
					allmp = allmp + 198;
					allpv = allpv + 1;
					allstr = allstr + 31;
					alldex = alldex + 13;
					alliint = alliint + 30;
					allweight = allweight + 5010;
					break;
				case 55:
					allhp = allhp + 683;
					allmp = allmp + 200;
					allpv = allpv + 1;
					allstr = allstr + 31;
					alldex = alldex + 13;
					alliint = alliint + 30;
					allweight = allweight + 5030;
					break;
				case 56:
					allhp = allhp + 693;
					allmp = allmp + 202;
					allpv = allpv + 1;
					allstr = allstr + 31;
					alldex = alldex + 13;
					alliint = alliint + 30;
					allweight = allweight + 5050;
					break;
				case 57:
					allhp = allhp + 706;
					allmp = allmp + 206;
					allpv = allpv + 1;
					allstr = allstr + 32;
					alldex = alldex + 13;
					alliint = alliint + 31;
					allweight = allweight + 5100;
					break;
				case 58:
					allhp = allhp + 716;
					allmp = allmp + 208;
					allpv = allpv + 1;
					allstr = allstr + 32;
					alldex = alldex + 13;
					alliint = alliint + 31;
					allweight = allweight + 5120;
					break;
				case 59:
					allhp = allhp + 726;
					allmp = allmp + 210;
					allpv = allpv + 1;
					allstr = allstr + 32;
					alldex = alldex + 13;
					alliint = alliint + 31;
					allweight = allweight + 5140;
					break;
				case 60:
					allhp = allhp + 739;
					allmp = allmp + 214;
					allpv = allpv + 1;
					allstr = allstr + 33;
					alldex = alldex + 14;
					alliint = alliint + 32;
					allweight = allweight + 5190;
					break;
				case 61:
					allhp = allhp + 749;
					allmp = allmp + 216;
					allpv = allpv + 1;
					allstr = allstr + 33;
					alldex = alldex + 14;
					alliint = alliint + 32;
					allweight = allweight + 5210;
					break;
				case 62:
					allhp = allhp + 759;
					allmp = allmp + 218;
					allpv = allpv + 1;
					allstr = allstr + 33;
					alldex = alldex + 14;
					alliint = alliint + 32;
					allweight = allweight + 5230;
					break;
				case 63:
					allhp = allhp + 772;
					allmp = allmp + 222;
					allpv = allpv + 1;
					allstr = allstr + 34;
					alldex = alldex + 14;
					alliint = alliint + 33;
					allweight = allweight + 5280;
					break;
				case 64:
					allhp = allhp + 782;
					allmp = allmp + 224;
					allpv = allpv + 1;
					allstr = allstr + 34;
					alldex = alldex + 14;
					alliint = alliint + 33;
					allweight = allweight + 5300;
					break;
				case 65:
					allhp = allhp + 792;
					allmp = allmp + 226;
					allpv = allpv + 1;
					allstr = allstr + 34;
					alldex = alldex + 14;
					alliint = alliint + 33;
					allweight = allweight + 5320;
					break;
				case 66:
					allhp = allhp + 805;
					allmp = allmp + 230;
					allpv = allpv + 1;
					allstr = allstr + 35;
					alldex = alldex + 14;
					alliint = alliint + 34;
					allweight = allweight + 5370;
					break;
				case 67:
					allhp = allhp + 815;
					allmp = allmp + 232;
					allpv = allpv + 1;
					allstr = allstr + 35;
					alldex = alldex + 14;
					alliint = alliint + 34;
					allweight = allweight + 5390;
					break;
				case 68:
					allhp = allhp + 825;
					allmp = allmp + 234;
					allpv = allpv + 1;
					allstr = allstr + 35;
					alldex = alldex + 14;
					alliint = alliint + 34;
					allweight = allweight + 5410;
					break;
				case 69:
					allhp = allhp + 838;
					allmp = allmp + 238;
					allpv = allpv + 1;
					allstr = allstr + 36;
					alldex = alldex + 14;
					alliint = alliint + 35;
					allweight = allweight + 5460;
					break;
				case 70:
					allhp = allhp + 848;
					allmp = allmp + 240;
					allpv = allpv + 1;
					allstr = allstr + 36;
					alldex = alldex + 14;
					alliint = alliint + 35;
					allweight = allweight + 5480;
					break;
				case 71:
					allhp = allhp + 858;
					allmp = allmp + 242;
					allpv = allpv + 1;
					allstr = allstr + 36;
					alldex = alldex + 14;
					alliint = alliint + 35;
					allweight = allweight + 5500;
					break;
				case 72:
					allhp = allhp + 871;
					allmp = allmp + 246;
					allpv = allpv + 1;
					allstr = allstr + 37;
					alldex = alldex + 14;
					alliint = alliint + 36;
					allweight = allweight + 5550;
					break;
				case 73:
					allhp = allhp + 881;
					allmp = allmp + 248;
					allpv = allpv + 1;
					allstr = allstr + 37;
					alldex = alldex + 14;
					alliint = alliint + 36;
					allweight = allweight + 5570;
					break;
				case 74:
					allhp = allhp + 891;
					allmp = allmp + 250;
					allpv = allpv + 1;
					allstr = allstr + 37;
					alldex = alldex + 14;
					alliint = alliint + 36;
					allweight = allweight + 5590;
					break;
				case 75:
					allhp = allhp + 904;
					allmp = allmp + 254;
					allpv = allpv + 1;
					allstr = allstr + 38;
					alldex = alldex + 15;
					alliint = alliint + 37;
					allweight = allweight + 5640;
					break;
				case 76:
					allhp = allhp + 914;
					allmp = allmp + 256;
					allpv = allpv + 1;
					allstr = allstr + 38;
					alldex = alldex + 15;
					alliint = alliint + 37;
					allweight = allweight + 5660;
					break;
				case 77:
					allhp = allhp + 924;
					allmp = allmp + 258;
					allpv = allpv + 1;
					allstr = allstr + 38;
					alldex = alldex + 15;
					alliint = alliint + 37;
					allweight = allweight + 5680;
					break;
				case 78:
					allhp = allhp + 937;
					allmp = allmp + 262;
					allpv = allpv + 1;
					allstr = allstr + 39;
					alldex = alldex + 15;
					alliint = alliint + 38;
					allweight = allweight + 5730;
					break;
				case 79:
					allhp = allhp + 947;
					allmp = allmp + 264;
					allpv = allpv + 1;
					allstr = allstr + 39;
					alldex = alldex + 15;
					alliint = alliint + 38;
					allweight = allweight + 5750;
					break;
				case 80:
					allhp = allhp + 957;
					allmp = allmp + 266;
					allpv = allpv + 1;
					allstr = allstr + 39;
					alldex = alldex + 15;
					alliint = alliint + 38;
					allweight = allweight + 5770;
					break;
				case 81:
					allhp = allhp + 970;
					allmp = allmp + 270;
					allpv = allpv + 1;
					allstr = allstr + 40;
					alldex = alldex + 15;
					alliint = alliint + 39;
					allweight = allweight + 5820;
					break;
				case 82:
					allhp = allhp + 980;
					allmp = allmp + 272;
					allpv = allpv + 1;
					allstr = allstr + 40;
					alldex = alldex + 15;
					alliint = alliint + 39;
					allweight = allweight + 5840;
					break;
				case 83:
					allhp = allhp + 990;
					allmp = allmp + 274;
					allpv = allpv + 1;
					allstr = allstr + 40;
					alldex = alldex + 15;
					alliint = alliint + 39;
					allweight = allweight + 5860;
					break;
				case 84:
					allhp = allhp + 1003;
					allmp = allmp + 278;
					allpv = allpv + 1;
					allstr = allstr + 41;
					alldex = alldex + 15;
					alliint = alliint + 40;
					allweight = allweight + 5910;
					break;
				case 85:
					allhp = allhp + 1013;
					allmp = allmp + 280;
					allpv = allpv + 1;
					allstr = allstr + 41;
					alldex = alldex + 15;
					alliint = alliint + 40;
					allweight = allweight + 5930;
					break;
				case 86:
					allhp = allhp + 1023;
					allmp = allmp + 282;
					allpv = allpv + 1;
					allstr = allstr + 41;
					alldex = alldex + 15;
					alliint = alliint + 40;
					allweight = allweight + 5950;
					break;
				case 87:
					allhp = allhp + 1036;
					allmp = allmp + 286;
					allpv = allpv + 1;
					allstr = allstr + 42;
					alldex = alldex + 15;
					alliint = alliint + 41;
					allweight = allweight + 6000;
					break;
				case 88:
					allhp = allhp + 1046;
					allmp = allmp + 288;
					allpv = allpv + 1;
					allstr = allstr + 42;
					alldex = alldex + 15;
					alliint = alliint + 41;
					allweight = allweight + 6020;
					break;
				case 89:
					allhp = allhp + 1056;
					allmp = allmp + 290;
					allpv = allpv + 1;
					allstr = allstr + 42;
					alldex = alldex + 15;
					alliint = alliint + 41;
					allweight = allweight + 6040;
					break;
				case 90:
					allhp = allhp + 1069;
					allmp = allmp + 294;
					allpv = allpv + 1;
					allstr = allstr + 43;
					alldex = alldex + 16;
					alliint = alliint + 42;
					allweight = allweight + 6090;
					break;
				case 91:
					allhp = allhp + 1079;
					allmp = allmp + 296;
					allpv = allpv + 1;
					allstr = allstr + 43;
					alldex = alldex + 16;
					alliint = alliint + 42;
					allweight = allweight + 6110;
					break;
				case 92:
					allhp = allhp + 1089;
					allmp = allmp + 298;
					allpv = allpv + 1;
					allstr = allstr + 43;
					alldex = alldex + 16;
					alliint = alliint + 42;
					allweight = allweight + 6130;
					break;
				case 93:
					allhp = allhp + 1102;
					allmp = allmp + 302;
					allpv = allpv + 1;
					allstr = allstr + 44;
					alldex = alldex + 16;
					alliint = alliint + 43;
					allweight = allweight + 6180;
					break;
				case 94:
					allhp = allhp + 1112;
					allmp = allmp + 304;
					allpv = allpv + 1;
					allstr = allstr + 44;
					alldex = alldex + 16;
					alliint = alliint + 43;
					allweight = allweight + 6200;
					break;
				case 95:
					allhp = allhp + 1122;
					allmp = allmp + 306;
					allpv = allpv + 1;
					allstr = allstr + 44;
					alldex = alldex + 16;
					alliint = alliint + 43;
					allweight = allweight + 6220;
					break;
				case 96:
					allhp = allhp + 1135;
					allmp = allmp + 310;
					allpv = allpv + 1;
					allstr = allstr + 45;
					alldex = alldex + 16;
					alliint = alliint + 44;
					allweight = allweight + 6270;
					break;
				case 97:
					allhp = allhp + 1145;
					allmp = allmp + 312;
					allpv = allpv + 1;
					allstr = allstr + 45;
					alldex = alldex + 16;
					alliint = alliint + 44;
					allweight = allweight + 6290;
					break;
				case 98:
					allhp = allhp + 1155;
					allmp = allmp + 314;
					allpv = allpv + 1;
					allstr = allstr + 45;
					alldex = alldex + 16;
					alliint = alliint + 44;
					allweight = allweight + 6310;
					break;
				case 99:
					allhp = allhp + 1168;
					allmp = allmp + 318;
					allpv = allpv + 1;
					allstr = allstr + 46;
					alldex = alldex + 16;
					alliint = alliint + 45;
					allweight = allweight + 6360;
					break;
				case 100:
					allhp = allhp + 1178;
					allmp = allmp + 320;
					allpv = allpv + 1;
					allstr = allstr + 46;
					alldex = alldex + 16;
					alliint = alliint + 45;
					allweight = allweight + 6380;
					break;
				case 101:
					allhp = allhp + 1188;
					allmp = allmp + 332;
					allpv = allpv + 1;
					allstr = allstr + 46;
					alldex = alldex + 16;
					alliint = alliint + 45;
					allweight = allweight + 6800;
					break;
				case 102:
					allhp = allhp + 1201;
					allmp = allmp + 346;
					allpv = allpv + 1;
					allstr = allstr + 47;
					alldex = alldex + 16;
					alliint = alliint + 46;
					allweight = allweight + 7250;
					break;
				case 103:
					allhp = allhp + 1211;
					allmp = allmp + 358;
					allpv = allpv + 1;
					allstr = allstr + 47;
					alldex = alldex + 16;
					alliint = alliint + 46;
					allweight = allweight + 7670;
					break;
				case 104:
					allhp = allhp + 1221;
					allmp = allmp + 370;
					allpv = allpv + 1;
					allstr = allstr + 47;
					alldex = alldex + 16;
					alliint = alliint + 46;
					allweight = allweight + 8090;
					break;
				case 105:
					allhp = allhp + 1234;
					allmp = allmp + 384;
					allpv = allpv + 1;
					allstr = allstr + 48;
					alldex = alldex + 17;
					alliint = alliint + 47;
					allweight = allweight + 8540;
					break;
				case 106:
					allhp = allhp + 1244;
					allmp = allmp + 396;
					allpv = allpv + 1;
					allstr = allstr + 48;
					alldex = alldex + 17;
					alliint = alliint + 47;
					allweight = allweight + 8960;
					break;
				case 107:
					allhp = allhp + 1254;
					allmp = allmp + 408;
					allpv = allpv + 1;
					allstr = allstr + 48;
					alldex = alldex + 17;
					alliint = alliint + 47;
					allweight = allweight + 9380;
					break;
				case 108:
					allhp = allhp + 1267;
					allmp = allmp + 422;
					allpv = allpv + 1;
					allstr = allstr + 49;
					alldex = alldex + 17;
					alliint = alliint + 48;
					allweight = allweight + 9830;
					break;
				case 109:
					allhp = allhp + 1277;
					allmp = allmp + 434;
					allpv = allpv + 1;
					allstr = allstr + 49;
					alldex = alldex + 17;
					alliint = alliint + 48;
					allweight = allweight + 10250;
					break;
				case 110:
					allhp = allhp + 1287;
					allmp = allmp + 446;
					allpv = allpv + 1;
					allstr = allstr + 49;
					alldex = alldex + 17;
					alliint = alliint + 48;
					allweight = allweight + 10670;
					break;
				case 111:
					allhp = allhp + 1300;
					allmp = allmp + 460;
					allpv = allpv + 1;
					allstr = allstr + 50;
					alldex = alldex + 17;
					alliint = alliint + 49;
					allweight = allweight + 11120;
					break;
				case 112:
					allhp = allhp + 1310;
					allmp = allmp + 472;
					allpv = allpv + 1;
					allstr = allstr + 50;
					alldex = alldex + 17;
					alliint = alliint + 49;
					allweight = allweight + 11540;
					break;
				case 113:
					allhp = allhp + 1320;
					allmp = allmp + 484;
					allpv = allpv + 1;
					allstr = allstr + 50;
					alldex = alldex + 17;
					alliint = alliint + 49;
					allweight = allweight + 11960;
					break;
				case 114:
					allhp = allhp + 1333;
					allmp = allmp + 498;
					allpv = allpv + 1;
					allstr = allstr + 51;
					alldex = alldex + 17;
					alliint = alliint + 50;
					allweight = allweight + 12410;
					break;
				case 115:
					allhp = allhp + 1343;
					allmp = allmp + 510;
					allpv = allpv + 1;
					allstr = allstr + 51;
					alldex = alldex + 17;
					alliint = alliint + 50;
					allweight = allweight + 12830;
					break;
				case 116:
					allhp = allhp + 1353;
					allmp = allmp + 522;
					allpv = allpv + 1;
					allstr = allstr + 51;
					alldex = alldex + 17;
					alliint = alliint + 50;
					allweight = allweight + 13250;
					break;
				case 117:
					allhp = allhp + 1366;
					allmp = allmp + 536;
					allpv = allpv + 1;
					allstr = allstr + 52;
					alldex = alldex + 17;
					alliint = alliint + 51;
					allweight = allweight + 13700;
					break;
				case 118:
					allhp = allhp + 1376;
					allmp = allmp + 548;
					allpv = allpv + 1;
					allstr = allstr + 52;
					alldex = alldex + 17;
					alliint = alliint + 51;
					allweight = allweight + 14120;
					break;
				case 119:
					allhp = allhp + 1386;
					allmp = allmp + 560;
					allpv = allpv + 1;
					allstr = allstr + 52;
					alldex = alldex + 17;
					alliint = alliint + 51;
					allweight = allweight + 14540;
					break;
				case 120:
					allhp = allhp + 1399;
					allmp = allmp + 574;
					allpv = allpv + 1;
					allstr = allstr + 53;
					alldex = alldex + 18;
					alliint = alliint + 52;
					allweight = allweight + 14990;
					break;
				case 121:
					allhp = allhp + 1409;
					allmp = allmp + 586;
					allpv = allpv + 1;
					allstr = allstr + 53;
					alldex = alldex + 18;
					alliint = alliint + 52;
					allweight = allweight + 15410;
					break;
				case 122:
					allhp = allhp + 1419;
					allmp = allmp + 598;
					allpv = allpv + 1;
					allstr = allstr + 53;
					alldex = alldex + 18;
					alliint = alliint + 52;
					allweight = allweight + 15830;
					break;
				case 123:
					allhp = allhp + 1432;
					allmp = allmp + 612;
					allpv = allpv + 1;
					allstr = allstr + 54;
					alldex = alldex + 18;
					alliint = alliint + 53;
					allweight = allweight + 16280;
					break;
				case 124:
					allhp = allhp + 1442;
					allmp = allmp + 624;
					allpv = allpv + 1;
					allstr = allstr + 54;
					alldex = alldex + 18;
					alliint = alliint + 53;
					allweight = allweight + 16700;
					break;
				case 125:
					allhp = allhp + 1452;
					allmp = allmp + 636;
					allpv = allpv + 1;
					allstr = allstr + 54;
					alldex = alldex + 18;
					alliint = alliint + 53;
					allweight = allweight + 17120;
					break;
				case 126:
					allhp = allhp + 1465;
					allmp = allmp + 650;
					allpv = allpv + 1;
					allstr = allstr + 55;
					alldex = alldex + 18;
					alliint = alliint + 54;
					allweight = allweight + 17570;
					break;
				case 127:
					allhp = allhp + 1475;
					allmp = allmp + 662;
					allpv = allpv + 1;
					allstr = allstr + 55;
					alldex = alldex + 18;
					alliint = alliint + 54;
					allweight = allweight + 17990;
					break;
				case 128:
					allhp = allhp + 1485;
					allmp = allmp + 674;
					allpv = allpv + 1;
					allstr = allstr + 55;
					alldex = alldex + 18;
					alliint = alliint + 54;
					allweight = allweight + 18410;
					break;
				case 129:
					allhp = allhp + 1498;
					allmp = allmp + 688;
					allpv = allpv + 1;
					allstr = allstr + 56;
					alldex = alldex + 18;
					alliint = alliint + 55;
					allweight = allweight + 18860;
					break;
				case 130:
					allhp = allhp + 1508;
					allmp = allmp + 700;
					allpv = allpv + 1;
					allstr = allstr + 56;
					alldex = alldex + 18;
					alliint = alliint + 55;
					allweight = allweight + 19280;
					break;
				case 131:
					allhp = allhp + 1518;
					allmp = allmp + 712;
					allpv = allpv + 1;
					allstr = allstr + 56;
					alldex = alldex + 18;
					alliint = alliint + 55;
					allweight = allweight + 19700;
					break;
				case 132:
					allhp = allhp + 1531;
					allmp = allmp + 726;
					allpv = allpv + 1;
					allstr = allstr + 57;
					alldex = alldex + 18;
					alliint = alliint + 56;
					allweight = allweight + 20150;
					break;
				case 133:
					allhp = allhp + 1541;
					allmp = allmp + 738;
					allpv = allpv + 1;
					allstr = allstr + 57;
					alldex = alldex + 18;
					alliint = alliint + 56;
					allweight = allweight + 20570;
					break;
				case 134:
					allhp = allhp + 1551;
					allmp = allmp + 750;
					allpv = allpv + 1;
					allstr = allstr + 57;
					alldex = alldex + 18;
					alliint = alliint + 56;
					allweight = allweight + 20990;
					break;
				case 135:
					allhp = allhp + 1564;
					allmp = allmp + 764;
					allpv = allpv + 1;
					allstr = allstr + 58;
					alldex = alldex + 19;
					alliint = alliint + 57;
					allweight = allweight + 21440;
					break;
				case 136:
					allhp = allhp + 1574;
					allmp = allmp + 776;
					allpv = allpv + 1;
					allstr = allstr + 58;
					alldex = alldex + 19;
					alliint = alliint + 57;
					allweight = allweight + 21860;
					break;
				case 137:
					allhp = allhp + 1584;
					allmp = allmp + 788;
					allpv = allpv + 1;
					allstr = allstr + 58;
					alldex = alldex + 19;
					alliint = alliint + 57;
					allweight = allweight + 22280;
					break;
				case 138:
					allhp = allhp + 1597;
					allmp = allmp + 802;
					allpv = allpv + 1;
					allstr = allstr + 59;
					alldex = alldex + 19;
					alliint = alliint + 58;
					allweight = allweight + 22730;
					break;
				case 139:
					allhp = allhp + 1607;
					allmp = allmp + 814;
					allpv = allpv + 1;
					allstr = allstr + 59;
					alldex = alldex + 19;
					alliint = alliint + 58;
					allweight = allweight + 23150;
					break;
				case 140:
					allhp = allhp + 1617;
					allmp = allmp + 826;
					allpv = allpv + 1;
					allstr = allstr + 59;
					alldex = alldex + 19;
					alliint = alliint + 58;
					allweight = allweight + 23570;
					break;
				case 141:
					allhp = allhp + 1630;
					allmp = allmp + 840;
					allpv = allpv + 1;
					allstr = allstr + 60;
					alldex = alldex + 19;
					alliint = alliint + 59;
					allweight = allweight + 24020;
					break;
				case 142:
					allhp = allhp + 1640;
					allmp = allmp + 852;
					allpv = allpv + 1;
					allstr = allstr + 60;
					alldex = alldex + 19;
					alliint = alliint + 59;
					allweight = allweight + 24440;
					break;
				case 143:
					allhp = allhp + 1650;
					allmp = allmp + 864;
					allpv = allpv + 1;
					allstr = allstr + 60;
					alldex = alldex + 19;
					alliint = alliint + 59;
					allweight = allweight + 24860;
					break;
				case 144:
					allhp = allhp + 1663;
					allmp = allmp + 878;
					allpv = allpv + 1;
					allstr = allstr + 61;
					alldex = alldex + 19;
					alliint = alliint + 60;
					allweight = allweight + 25310;
					break;
				case 145:
					allhp = allhp + 1673;
					allmp = allmp + 890;
					allpv = allpv + 1;
					allstr = allstr + 61;
					alldex = alldex + 19;
					alliint = alliint + 60;
					allweight = allweight + 25730;
					break;
				case 146:
					allhp = allhp + 1683;
					allmp = allmp + 902;
					allpv = allpv + 1;
					allstr = allstr + 61;
					alldex = alldex + 19;
					alliint = alliint + 60;
					allweight = allweight + 26150;
					break;
				case 147:
					allhp = allhp + 1696;
					allmp = allmp + 916;
					allpv = allpv + 1;
					allstr = allstr + 62;
					alldex = alldex + 19;
					alliint = alliint + 61;
					allweight = allweight + 26600;
					break;
				case 148:
					allhp = allhp + 1706;
					allmp = allmp + 928;
					allpv = allpv + 1;
					allstr = allstr + 62;
					alldex = alldex + 19;
					alliint = alliint + 61;
					allweight = allweight + 27020;
					break;
				case 149:
					allhp = allhp + 1716;
					allmp = allmp + 940;
					allpv = allpv + 1;
					allstr = allstr + 62;
					alldex = alldex + 19;
					alliint = alliint + 61;
					allweight = allweight + 27440;
					break;
				case 150:
					allhp = allhp + 1729;
					allmp = allmp + 954;
					allpv = allpv + 1;
					allstr = allstr + 63;
					alldex = alldex + 20;
					alliint = alliint + 62;
					allweight = allweight + 27890;
					break;
				case 151:
					allhp = allhp + 1739;
					allmp = allmp + 966;
					allpv = allpv + 1;
					allstr = allstr + 63;
					alldex = alldex + 20;
					alliint = alliint + 62;
					allweight = allweight + 28310;
					break;
				case 152:
					allhp = allhp + 1749;
					allmp = allmp + 978;
					allpv = allpv + 1;
					allstr = allstr + 63;
					alldex = alldex + 20;
					alliint = alliint + 62;
					allweight = allweight + 28730;
					break;
				case 153:
					allhp = allhp + 1762;
					allmp = allmp + 992;
					allpv = allpv + 1;
					allstr = allstr + 64;
					alldex = alldex + 20;
					alliint = alliint + 63;
					allweight = allweight + 29180;
					break;
				case 154:
					allhp = allhp + 1772;
					allmp = allmp + 1004;
					allpv = allpv + 1;
					allstr = allstr + 64;
					alldex = alldex + 20;
					alliint = alliint + 63;
					allweight = allweight + 29600;
					break;
				case 155:
					allhp = allhp + 1782;
					allmp = allmp + 1016;
					allpv = allpv + 1;
					allstr = allstr + 64;
					alldex = alldex + 20;
					alliint = alliint + 63;
					allweight = allweight + 30020;
					break;
				case 156:
					allhp = allhp + 1795;
					allmp = allmp + 1030;
					allpv = allpv + 1;
					allstr = allstr + 65;
					alldex = alldex + 20;
					alliint = alliint + 64;
					allweight = allweight + 30470;
					break;
				case 157:
					allhp = allhp + 1805;
					allmp = allmp + 1042;
					allpv = allpv + 1;
					allstr = allstr + 65;
					alldex = alldex + 20;
					alliint = alliint + 64;
					allweight = allweight + 30890;
					break;
				case 158:
					allhp = allhp + 1815;
					allmp = allmp + 1054;
					allpv = allpv + 1;
					allstr = allstr + 65;
					alldex = alldex + 20;
					alliint = alliint + 64;
					allweight = allweight + 31310;
					break;
				case 159:
					allhp = allhp + 1828;
					allmp = allmp + 1068;
					allpv = allpv + 1;
					allstr = allstr + 66;
					alldex = alldex + 20;
					alliint = alliint + 65;
					allweight = allweight + 31760;
					break;
				case 160:
					allhp = allhp + 1838;
					allmp = allmp + 1080;
					allpv = allpv + 1;
					allstr = allstr + 66;
					alldex = alldex + 20;
					alliint = alliint + 65;
					allweight = allweight + 32180;
					break;
				case 161:
					allhp = allhp + 1848;
					allmp = allmp + 1092;
					allpv = allpv + 1;
					allstr = allstr + 66;
					alldex = alldex + 20;
					alliint = alliint + 65;
					allweight = allweight + 32600;
					break;
				case 162:
					allhp = allhp + 1861;
					allmp = allmp + 1106;
					allpv = allpv + 1;
					allstr = allstr + 67;
					alldex = alldex + 20;
					alliint = alliint + 66;
					allweight = allweight + 33050;
					break;
				case 163:
					allhp = allhp + 1871;
					allmp = allmp + 1118;
					allpv = allpv + 1;
					allstr = allstr + 67;
					alldex = alldex + 20;
					alliint = alliint + 66;
					allweight = allweight + 33470;
					break;
				case 164:
					allhp = allhp + 1881;
					allmp = allmp + 1130;
					allpv = allpv + 1;
					allstr = allstr + 67;
					alldex = alldex + 20;
					alliint = alliint + 66;
					allweight = allweight + 33890;
					break;
				case 165:
					allhp = allhp + 1894;
					allmp = allmp + 1144;
					allpv = allpv + 1;
					allstr = allstr + 68;
					alldex = alldex + 21;
					alliint = alliint + 67;
					allweight = allweight + 34340;
					break;
				case 166:
					allhp = allhp + 1904;
					allmp = allmp + 1156;
					allpv = allpv + 1;
					allstr = allstr + 68;
					alldex = alldex + 21;
					alliint = alliint + 67;
					allweight = allweight + 34760;
					break;
				case 167:
					allhp = allhp + 1914;
					allmp = allmp + 1168;
					allpv = allpv + 1;
					allstr = allstr + 68;
					alldex = alldex + 21;
					alliint = alliint + 67;
					allweight = allweight + 35180;
					break;
				case 168:
					allhp = allhp + 1927;
					allmp = allmp + 1182;
					allpv = allpv + 1;
					allstr = allstr + 69;
					alldex = alldex + 21;
					alliint = alliint + 68;
					allweight = allweight + 35630;
					break;
				case 169:
					allhp = allhp + 1937;
					allmp = allmp + 1194;
					allpv = allpv + 1;
					allstr = allstr + 69;
					alldex = alldex + 21;
					alliint = alliint + 68;
					allweight = allweight + 36050;
					break;
				case 170:
					allhp = allhp + 1947;
					allmp = allmp + 1206;
					allpv = allpv + 1;
					allstr = allstr + 69;
					alldex = alldex + 21;
					alliint = alliint + 68;
					allweight = allweight + 36470;
					break;
				case 171:
					allhp = allhp + 1960;
					allmp = allmp + 1220;
					allpv = allpv + 1;
					allstr = allstr + 70;
					alldex = alldex + 21;
					alliint = alliint + 69;
					allweight = allweight + 36920;
					break;
				case 172:
					allhp = allhp + 1970;
					allmp = allmp + 1232;
					allpv = allpv + 1;
					allstr = allstr + 70;
					alldex = alldex + 21;
					alliint = alliint + 69;
					allweight = allweight + 37340;
					break;
				case 173:
					allhp = allhp + 1980;
					allmp = allmp + 1244;
					allpv = allpv + 1;
					allstr = allstr + 70;
					alldex = alldex + 21;
					alliint = alliint + 69;
					allweight = allweight + 37760;
					break;
				case 174:
					allhp = allhp + 1993;
					allmp = allmp + 1258;
					allpv = allpv + 1;
					allstr = allstr + 71;
					alldex = alldex + 21;
					alliint = alliint + 70;
					allweight = allweight + 38210;
					break;
				case 175:
					allhp = allhp + 2003;
					allmp = allmp + 1270;
					allpv = allpv + 1;
					allstr = allstr + 71;
					alldex = alldex + 21;
					alliint = alliint + 70;
					allweight = allweight + 38630;
					break;
				case 176:
					allhp = allhp + 2013;
					allmp = allmp + 1282;
					allpv = allpv + 1;
					allstr = allstr + 71;
					alldex = alldex + 21;
					alliint = alliint + 70;
					allweight = allweight + 39050;
					break;
				case 177:
					allhp = allhp + 2026;
					allmp = allmp + 1296;
					allpv = allpv + 1;
					allstr = allstr + 72;
					alldex = alldex + 21;
					alliint = alliint + 71;
					allweight = allweight + 39500;
					break;
				case 178:
					allhp = allhp + 2036;
					allmp = allmp + 1308;
					allpv = allpv + 1;
					allstr = allstr + 72;
					alldex = alldex + 21;
					alliint = alliint + 71;
					allweight = allweight + 39920;
					break;
				case 179:
					allhp = allhp + 2046;
					allmp = allmp + 1320;
					allpv = allpv + 1;
					allstr = allstr + 72;
					alldex = alldex + 21;
					alliint = alliint + 71;
					allweight = allweight + 40340;
					break;
				case 180:
					allhp = allhp + 2059;
					allmp = allmp + 1334;
					allpv = allpv + 1;
					allstr = allstr + 73;
					alldex = alldex + 22;
					alliint = alliint + 72;
					allweight = allweight + 40790;
					break;
				case 181:
					allhp = allhp + 2069;
					allmp = allmp + 1346;
					allpv = allpv + 1;
					allstr = allstr + 73;
					alldex = alldex + 22;
					alliint = alliint + 72;
					allweight = allweight + 41210;
					break;
				case 182:
					allhp = allhp + 2079;
					allmp = allmp + 1358;
					allpv = allpv + 1;
					allstr = allstr + 73;
					alldex = alldex + 22;
					alliint = alliint + 72;
					allweight = allweight + 41630;
					break;
				case 183:
					allhp = allhp + 2092;
					allmp = allmp + 1372;
					allpv = allpv + 1;
					allstr = allstr + 74;
					alldex = alldex + 22;
					alliint = alliint + 73;
					allweight = allweight + 42080;
					break;
				case 184:
					allhp = allhp + 2102;
					allmp = allmp + 1384;
					allpv = allpv + 1;
					allstr = allstr + 74;
					alldex = alldex + 22;
					alliint = alliint + 73;
					allweight = allweight + 42500;
					break;
				case 185:
					allhp = allhp + 2112;
					allmp = allmp + 1396;
					allpv = allpv + 1;
					allstr = allstr + 74;
					alldex = alldex + 22;
					alliint = alliint + 73;
					allweight = allweight + 42920;
					break;
				case 186:
					allhp = allhp + 2125;
					allmp = allmp + 1410;
					allpv = allpv + 1;
					allstr = allstr + 75;
					alldex = alldex + 22;
					alliint = alliint + 74;
					allweight = allweight + 43370;
					break;
				case 187:
					allhp = allhp + 2135;
					allmp = allmp + 1422;
					allpv = allpv + 1;
					allstr = allstr + 75;
					alldex = alldex + 22;
					alliint = alliint + 74;
					allweight = allweight + 43790;
					break;
				case 188:
					allhp = allhp + 2145;
					allmp = allmp + 1434;
					allpv = allpv + 1;
					allstr = allstr + 75;
					alldex = alldex + 22;
					alliint = alliint + 74;
					allweight = allweight + 44210;
					break;
				case 189:
					allhp = allhp + 2158;
					allmp = allmp + 1448;
					allpv = allpv + 1;
					allstr = allstr + 76;
					alldex = alldex + 22;
					alliint = alliint + 75;
					allweight = allweight + 44660;
					break;
				case 190:
					allhp = allhp + 2168;
					allmp = allmp + 1460;
					allpv = allpv + 1;
					allstr = allstr + 76;
					alldex = alldex + 22;
					alliint = alliint + 75;
					allweight = allweight + 45080;
					break;
				case 191:
					allhp = allhp + 2178;
					allmp = allmp + 1472;
					allpv = allpv + 1;
					allstr = allstr + 76;
					alldex = alldex + 22;
					alliint = alliint + 75;
					allweight = allweight + 45500;
					break;
				case 192:
					allhp = allhp + 2191;
					allmp = allmp + 1486;
					allpv = allpv + 1;
					allstr = allstr + 77;
					alldex = alldex + 22;
					alliint = alliint + 76;
					allweight = allweight + 45950;
					break;
				case 193:
					allhp = allhp + 2201;
					allmp = allmp + 1498;
					allpv = allpv + 1;
					allstr = allstr + 77;
					alldex = alldex + 22;
					alliint = alliint + 76;
					allweight = allweight + 46370;
					break;
				case 194:
					allhp = allhp + 2211;
					allmp = allmp + 1510;
					allpv = allpv + 1;
					allstr = allstr + 77;
					alldex = alldex + 22;
					alliint = alliint + 76;
					allweight = allweight + 46790;
					break;
				case 195:
					allhp = allhp + 2224;
					allmp = allmp + 1524;
					allpv = allpv + 1;
					allstr = allstr + 78;
					alldex = alldex + 23;
					alliint = alliint + 77;
					allweight = allweight + 47240;
					break;
				case 196:
					allhp = allhp + 2234;
					allmp = allmp + 1536;
					allpv = allpv + 1;
					allstr = allstr + 78;
					alldex = alldex + 23;
					alliint = alliint + 77;
					allweight = allweight + 47660;
					break;
				case 197:
					allhp = allhp + 2244;
					allmp = allmp + 1548;
					allpv = allpv + 1;
					allstr = allstr + 78;
					alldex = alldex + 23;
					alliint = alliint + 77;
					allweight = allweight + 48080;
					break;
				case 198:
					allhp = allhp + 2257;
					allmp = allmp + 1562;
					allpv = allpv + 1;
					allstr = allstr + 79;
					alldex = alldex + 23;
					alliint = alliint + 78;
					allweight = allweight + 48530;
					break;
				case 199:
					allhp = allhp + 2267;
					allmp = allmp + 1574;
					allpv = allpv + 1;
					allstr = allstr + 79;
					alldex = alldex + 23;
					alliint = alliint + 78;
					allweight = allweight + 48950;
					break;
				case 200:
					allhp = allhp + 2277;
					allmp = allmp + 1586;
					allpv = allpv + 1;
					allstr = allstr + 79;
					alldex = alldex + 23;
					alliint = alliint + 78;
					allweight = allweight + 49370;
					break;
				case 201:
					allhp = allhp + 2290;
					allmp = allmp + 1600;
					allpv = allpv + 1;
					allstr = allstr + 80;
					alldex = alldex + 23;
					alliint = alliint + 79;
					allweight = allweight + 49820;
					break;
				case 202:
					allhp = allhp + 2300;
					allmp = allmp + 1612;
					allpv = allpv + 1;
					allstr = allstr + 80;
					alldex = alldex + 23;
					alliint = alliint + 79;
					allweight = allweight + 50240;
					break;
				case 203:
					allhp = allhp + 2310;
					allmp = allmp + 1624;
					allpv = allpv + 1;
					allstr = allstr + 80;
					alldex = alldex + 23;
					alliint = alliint + 79;
					allweight = allweight + 50660;
					break;
				case 204:
					allhp = allhp + 2323;
					allmp = allmp + 1638;
					allpv = allpv + 1;
					allstr = allstr + 81;
					alldex = alldex + 23;
					alliint = alliint + 80;
					allweight = allweight + 51110;
					break;
				case 205:
					allhp = allhp + 2333;
					allmp = allmp + 1650;
					allpv = allpv + 1;
					allstr = allstr + 81;
					alldex = alldex + 23;
					alliint = alliint + 80;
					allweight = allweight + 51530;
					break;
				case 206:
					allhp = allhp + 2343;
					allmp = allmp + 1662;
					allpv = allpv + 1;
					allstr = allstr + 81;
					alldex = alldex + 23;
					alliint = alliint + 80;
					allweight = allweight + 51950;
					break;
				case 207:
					allhp = allhp + 2356;
					allmp = allmp + 1676;
					allpv = allpv + 1;
					allstr = allstr + 82;
					alldex = alldex + 23;
					alliint = alliint + 81;
					allweight = allweight + 52400;
					break;
				case 208:
					allhp = allhp + 2366;
					allmp = allmp + 1688;
					allpv = allpv + 1;
					allstr = allstr + 82;
					alldex = alldex + 23;
					alliint = alliint + 81;
					allweight = allweight + 52820;
					break;
				case 209:
					allhp = allhp + 2376;
					allmp = allmp + 1700;
					allpv = allpv + 1;
					allstr = allstr + 82;
					alldex = alldex + 23;
					alliint = alliint + 81;
					allweight = allweight + 53240;
					break;
				case 210:
					allhp = allhp + 2389;
					allmp = allmp + 1714;
					allpv = allpv + 1;
					allstr = allstr + 83;
					alldex = alldex + 24;
					alliint = alliint + 82;
					allweight = allweight + 53690;
					break;
				case 211:
					allhp = allhp + 2399;
					allmp = allmp + 1726;
					allpv = allpv + 1;
					allstr = allstr + 83;
					alldex = alldex + 24;
					alliint = alliint + 82;
					allweight = allweight + 54110;
					break;
				case 212:
					allhp = allhp + 2409;
					allmp = allmp + 1738;
					allpv = allpv + 1;
					allstr = allstr + 83;
					alldex = alldex + 24;
					alliint = alliint + 82;
					allweight = allweight + 54530;
					break;
				case 213:
					allhp = allhp + 2422;
					allmp = allmp + 1752;
					allpv = allpv + 1;
					allstr = allstr + 84;
					alldex = alldex + 24;
					alliint = alliint + 83;
					allweight = allweight + 54980;
					break;
				case 214:
					allhp = allhp + 2432;
					allmp = allmp + 1764;
					allpv = allpv + 1;
					allstr = allstr + 84;
					alldex = alldex + 24;
					alliint = alliint + 83;
					allweight = allweight + 55400;
					break;
				case 215:
					allhp = allhp + 2442;
					allmp = allmp + 1776;
					allpv = allpv + 1;
					allstr = allstr + 84;
					alldex = alldex + 24;
					alliint = alliint + 83;
					allweight = allweight + 55820;
					break;
				case 216:
					allhp = allhp + 2455;
					allmp = allmp + 1790;
					allpv = allpv + 1;
					allstr = allstr + 85;
					alldex = alldex + 24;
					alliint = alliint + 84;
					allweight = allweight + 56270;
					break;
				case 217:
					allhp = allhp + 2465;
					allmp = allmp + 1802;
					allpv = allpv + 1;
					allstr = allstr + 85;
					alldex = alldex + 24;
					alliint = alliint + 84;
					allweight = allweight + 56690;
					break;
				case 218:
					allhp = allhp + 2475;
					allmp = allmp + 1814;
					allpv = allpv + 1;
					allstr = allstr + 85;
					alldex = alldex + 24;
					alliint = alliint + 84;
					allweight = allweight + 57110;
					break;
				case 219:
					allhp = allhp + 2488;
					allmp = allmp + 1828;
					allpv = allpv + 1;
					allstr = allstr + 86;
					alldex = alldex + 24;
					alliint = alliint + 85;
					allweight = allweight + 57560;
					break;
				case 220:
					allhp = allhp + 2498;
					allmp = allmp + 1840;
					allpv = allpv + 1;
					allstr = allstr + 86;
					alldex = alldex + 24;
					alliint = alliint + 85;
					allweight = allweight + 57980;
					break;
				case 221:
					allhp = allhp + 2508;
					allmp = allmp + 1852;
					allpv = allpv + 1;
					allstr = allstr + 86;
					alldex = alldex + 24;
					alliint = alliint + 85;
					allweight = allweight + 58400;
					break;
				case 222:
					allhp = allhp + 2521;
					allmp = allmp + 1866;
					allpv = allpv + 1;
					allstr = allstr + 87;
					alldex = alldex + 24;
					alliint = alliint + 86;
					allweight = allweight + 58850;
					break;
				case 223:
					allhp = allhp + 2531;
					allmp = allmp + 1878;
					allpv = allpv + 1;
					allstr = allstr + 87;
					alldex = alldex + 24;
					alliint = alliint + 86;
					allweight = allweight + 59270;
					break;
				case 224:
					allhp = allhp + 2541;
					allmp = allmp + 1890;
					allpv = allpv + 1;
					allstr = allstr + 87;
					alldex = alldex + 24;
					alliint = alliint + 86;
					allweight = allweight + 59690;
					break;
				case 225:
					allhp = allhp + 2554;
					allmp = allmp + 1904;
					allpv = allpv + 1;
					allstr = allstr + 88;
					alldex = alldex + 25;
					alliint = alliint + 87;
					allweight = allweight + 60140;
					break;
				case 226:
					allhp = allhp + 2564;
					allmp = allmp + 1916;
					allpv = allpv + 1;
					allstr = allstr + 88;
					alldex = alldex + 25;
					alliint = alliint + 87;
					allweight = allweight + 60560;
					break;
				case 227:
					allhp = allhp + 2574;
					allmp = allmp + 1928;
					allpv = allpv + 1;
					allstr = allstr + 88;
					alldex = alldex + 25;
					alliint = alliint + 87;
					allweight = allweight + 60980;
					break;
				case 228:
					allhp = allhp + 2587;
					allmp = allmp + 1942;
					allpv = allpv + 1;
					allstr = allstr + 89;
					alldex = alldex + 25;
					alliint = alliint + 88;
					allweight = allweight + 61430;
					break;
				case 229:
					allhp = allhp + 2597;
					allmp = allmp + 1954;
					allpv = allpv + 1;
					allstr = allstr + 89;
					alldex = alldex + 25;
					alliint = alliint + 88;
					allweight = allweight + 61850;
					break;
				case 230:
					allhp = allhp + 2607;
					allmp = allmp + 1966;
					allpv = allpv + 1;
					allstr = allstr + 89;
					alldex = alldex + 25;
					alliint = alliint + 88;
					allweight = allweight + 62270;
					break;
				case 231:
					allhp = allhp + 2620;
					allmp = allmp + 1980;
					allpv = allpv + 1;
					allstr = allstr + 90;
					alldex = alldex + 25;
					alliint = alliint + 89;
					allweight = allweight + 62720;
					break;
				case 232:
					allhp = allhp + 2630;
					allmp = allmp + 1992;
					allpv = allpv + 1;
					allstr = allstr + 90;
					alldex = alldex + 25;
					alliint = alliint + 89;
					allweight = allweight + 63140;
					break;
				case 233:
					allhp = allhp + 2640;
					allmp = allmp + 2004;
					allpv = allpv + 1;
					allstr = allstr + 90;
					alldex = alldex + 25;
					alliint = alliint + 89;
					allweight = allweight + 63560;
					break;
				case 234:
					allhp = allhp + 2653;
					allmp = allmp + 2018;
					allpv = allpv + 1;
					allstr = allstr + 91;
					alldex = alldex + 25;
					alliint = alliint + 90;
					allweight = allweight + 64010;
					break;
				case 235:
					allhp = allhp + 2663;
					allmp = allmp + 2030;
					allpv = allpv + 1;
					allstr = allstr + 91;
					alldex = alldex + 25;
					alliint = alliint + 90;
					allweight = allweight + 64430;
					break;
				case 236:
					allhp = allhp + 2673;
					allmp = allmp + 2042;
					allpv = allpv + 1;
					allstr = allstr + 91;
					alldex = alldex + 25;
					alliint = alliint + 90;
					allweight = allweight + 64850;
					break;
				case 237:
					allhp = allhp + 2686;
					allmp = allmp + 2056;
					allpv = allpv + 1;
					allstr = allstr + 92;
					alldex = alldex + 25;
					alliint = alliint + 91;
					allweight = allweight + 65300;
					break;
				case 238:
					allhp = allhp + 2696;
					allmp = allmp + 2068;
					allpv = allpv + 1;
					allstr = allstr + 92;
					alldex = alldex + 25;
					alliint = alliint + 91;
					allweight = allweight + 65720;
					break;
				case 239:
					allhp = allhp + 2706;
					allmp = allmp + 2080;
					allpv = allpv + 1;
					allstr = allstr + 92;
					alldex = alldex + 25;
					alliint = alliint + 91;
					allweight = allweight + 66140;
					break;
				case 240:
					allhp = allhp + 2719;
					allmp = allmp + 2094;
					allpv = allpv + 1;
					allstr = allstr + 93;
					alldex = alldex + 26;
					alliint = alliint + 92;
					allweight = allweight + 66590;
					break;
				case 241:
					allhp = allhp + 2729;
					allmp = allmp + 2106;
					allpv = allpv + 1;
					allstr = allstr + 93;
					alldex = alldex + 26;
					alliint = alliint + 92;
					allweight = allweight + 67010;
					break;
				case 242:
					allhp = allhp + 2739;
					allmp = allmp + 2118;
					allpv = allpv + 1;
					allstr = allstr + 93;
					alldex = alldex + 26;
					alliint = alliint + 92;
					allweight = allweight + 67430;
					break;
				case 243:
					allhp = allhp + 2752;
					allmp = allmp + 2132;
					allpv = allpv + 1;
					allstr = allstr + 94;
					alldex = alldex + 26;
					alliint = alliint + 93;
					allweight = allweight + 67880;
					break;
				case 244:
					allhp = allhp + 2762;
					allmp = allmp + 2144;
					allpv = allpv + 1;
					allstr = allstr + 94;
					alldex = alldex + 26;
					alliint = alliint + 93;
					allweight = allweight + 68300;
					break;
				case 245:
					allhp = allhp + 2772;
					allmp = allmp + 2156;
					allpv = allpv + 1;
					allstr = allstr + 94;
					alldex = alldex + 26;
					alliint = alliint + 93;
					allweight = allweight + 68720;
					break;
				case 246:
					allhp = allhp + 2785;
					allmp = allmp + 2170;
					allpv = allpv + 1;
					allstr = allstr + 95;
					alldex = alldex + 26;
					alliint = alliint + 94;
					allweight = allweight + 69170;
					break;
				case 247:
					allhp = allhp + 2795;
					allmp = allmp + 2182;
					allpv = allpv + 1;
					allstr = allstr + 95;
					alldex = alldex + 26;
					alliint = alliint + 94;
					allweight = allweight + 69590;
					break;
				case 248:
					allhp = allhp + 2805;
					allmp = allmp + 2194;
					allpv = allpv + 1;
					allstr = allstr + 95;
					alldex = alldex + 26;
					alliint = alliint + 94;
					allweight = allweight + 70010;
					break;
				case 249:
					allhp = allhp + 2818;
					allmp = allmp + 2208;
					allpv = allpv + 1;
					allstr = allstr + 96;
					alldex = alldex + 26;
					alliint = alliint + 95;
					allweight = allweight + 70460;
					break;
				case 250:
					allhp = allhp + 2828;
					allmp = allmp + 2220;
					allpv = allpv + 1;
					allstr = allstr + 96;
					alldex = alldex + 26;
					alliint = alliint + 95;
					allweight = allweight + 70880;
					break;
                default:
                    alert("Level must be 1-250");
            }
        }

        $('#mp').html(allmp);
        $('#weight').html(allweight);

        $('#str').html(allstr);
        $('#dex').html(alldex);
        $('#iint').html(alliint);
        $('#pv').html(allpv);
        $('#hp').html(allhp);

        //this.UpdateSphSetData();

        if (countUpdateItems === 0) {}
    },

    // Проверяем сет сфер
    /*UpdateSphSetData: function(){
        var sph = ['0015', '0016', '0017', '0018', '0019'],
            selection = -1, app = -1,
            allIdentical = 0, item;


        for (var i = sph.length - 1; i >= 0; i--) {

            item = Dolls.allTypes[sph[i]];

            if(item == 0){
                continue;
            }

            if(selection == -1 && item.data.selection > 0){
                selection = item.data.selection;
                app = item.app;
            }

            if(selection == item.data.selection && item.app == app){
                allIdentical++;
            }

        }

        // Собран сет
        if(allIdentical == 5){
            // Запрашиваем инфомрацию по сету
            $.ajax({
                url: '/ajax/Dolls/GetSelection/',
                data: {
                    'selection': selection,
                    'app': app,
                },
                dataType: 'json',
                type: 'post',
                success: function(result){

                    if(result.type == 'success'){
                        $('.selection-bonus').html( result.text );
                    }
                },
                error: function(){

                }
            })
        }
        else
        {
            $('.selection-bonus').html('');
        }
    },*/
    Search: function (_this) {

        let list = {}, input = $(_this), item;
        let searchStr = input.val(), type = Dolls.selectedType;

        if (searchStr.length > 0) {
            $('#load-items').html('');

            for (let itemKey in Dolls.actualList) {
                if (Dolls.actualList[itemKey].title.search(RegExp(searchStr, 'i')) > -1) {
                    item = $('<div></div>').html(
                        '<div class="item" id="' + Dolls.actualList[itemKey].id + '" data-image="' + Dolls.actualList[itemKey].icon + '" data-type="' + type + '">' +
                        '<div class="icon"><img src="' + Dolls.actualList[itemKey].icon + '" alt=""></div>' +
                        '<div class="title">' + Dolls.actualList[itemKey].title + '</div>' +
                        '</div>'
                    );
                    $('#load-items').append(item);
                }
            }
        } else {
            for (let itemKey in Dolls.actualList) {

                item = $('<div></div>').html(
                    '<div class="item" id="' + Dolls.actualList[itemKey].id + '" data-image="' + Dolls.actualList[itemKey].icon + '" data-type="' + type + '">' +
                    '<div class="icon"><img src="' + Dolls.actualList[itemKey].icon + '" alt=""></div>' +
                    '<div class="title">' + Dolls.actualList[itemKey].title + '</div>' +
                    '</div>'
                );

                $('#load-items').append(item);
            }
        }

        return list;
    },
    SaveDollClose: function (btn) {
        $('.modal-bg').hide();
        $('.save').hide();
    },
    SaveDoll: function (btn) {
        // this.showPreloader();
        // $('#global-preloader').show();
        this.showPreloader();

        $("html").addClass("hide-scrollbar");
        $('html,body').scrollTop(0);
        var el = document.getElementById('doll-layout');
        html2canvas(el, {
            width: el.offsetWidth + 10,
            height: el.offsetHeight,
            backgroundColor: null
        }).then(canvas => {
            img = canvas.toDataURL("image/png");

            var base64ImageContent = img.replace(/^data:image\/(png|jpg);base64,/, "");

            $.ajax({
                url: '/ror-game/doll/save',
                data: {
                    'content': Dolls.allTypes,
                    'id-class': $('#doll-class').val(),
                    'level': $('#level').val(),
                    'image': JSON.stringify(base64ImageContent),
                    '_xfToken': document.getElementsByName('_xfToken')[0].value,
                    '_xfResponseType': "json",
                    'form-data': $(btn).parent().serialize()
                },
                type: 'post',
                dataType: 'json',
                success: function (result) {
                    // Выводим сообщение о том, что древо сохранилось
                    $('.preloader-bg').hide();
                    $('.preloader').hide();

                    // $('.save-bg').hide();
                    $('.save').hide();

                    Dolls.loadModalSaveResultWindow(result);

                    // location.reload();
                    return false;
                }
            });

            $("html").removeClass("hide-scrollbar");

        });


        return false;
    },
    showPreloader: function () {
        var preloader = $('.preloader');
        var left = (window.innerWidth - preloader.width()) / 2;
        var top = (window.innerHeight - preloader.height()) / 2;
        preloader.show().css({
            'left': left,
            'top': top
        });

        $('.preloader-bg').show();
    },
    loadModalSaveResultWindow: function (result) {
        var modalSave = $('.save-result');
        var left = (window.innerWidth - modalSave.width()) / 2;
        var top = (window.innerHeight - modalSave.height()) / 2;
        modalSave.show().css({
            'left': left,
            'top': top
        });

        $('.save-windows-link').val(result.link);
        $('.save-windows-linkimg').val(result.linkimg);
        $('.save-windows-img').attr('src', result.linkimg);

        history.replaceState(null, null, result.url);

    }
};

/*$(document).on('click', '.app', function(e){
    $('#bg-layout-app').show();
    var appCount = $(this).find('span').text();
    var appModal = $('<div>');

    appModal.addClass('app-active');

    var btns = '<div class="arrow-btn-set"><i class="fa fa-chevron-up btn-set-app plus"></i><i class="fa fa-chevron-down btn-set-app minus"></i></div>';
    appModal.html('<span>+</span><form><input value="'+appCount+'" type="text" name="count" size="2">'+btns+'</form>');

    $(this).parent().prepend(appModal);
    $(this).parent().find('input').select();

    return false;
});*/

$(document).on('click', '#minus', function (e) {
    Dolls.UpdateDollInformation();
});

$(document).on('click', '#plus', function (e) {
    Dolls.UpdateDollInformation();
});

$(document).on('cut change copy paste', '#level', function (e) {
    Dolls.UpdateDollInformation();
});


/*$(document).on('keypress', '[name="count"]', function(e){
    var maxApp = 13, actual;

    var app = parseInt(e.key),
        pr = $(this).parent().parent(),
        activeItem = pr.parent(),
        typeItem = activeItem.parent().attr('data-num');

    maxApp = pr.parent().attr('data-max-app');

    if(e.key == 'Enter'){

        actual = $(this).val();

        actual = parseInt(actual);
        if(actual > maxApp){
            actual = maxApp;
        }

        Dolls.allTypes[ typeItem ].app = actual;

        pr.next().find('span').html( actual );
        pr.remove();

        $('#bg-layout-app').hide();

        Dolls.UpdateDollInformation();

        return false;
    }

    if(parseInt(e.key) != e.key || isNaN(parseInt(e.key))){
        return false;
    }

    actual = $(this).val();
    if(actual == 0){
        actual = '';
    }

});*/

/*$(document).on('click', '#bg-layout-app', function(e){

    var activeItem = $('.app-active'), maxApp = 13;
    if(activeItem.length > 0){

        actual = $(activeItem).find('input').val();

        if(actual > maxApp){
            actual = maxApp;
        }


        var typeItem = $(activeItem).parent().parent().attr('data-num');

        Dolls.allTypes[ typeItem ].app = actual;

        $(activeItem).next().find('span').html( actual );
        $(activeItem).remove();

        $('#bg-layout-app').hide();

        Dolls.UpdateDollInformation();

        return false;
    }

    $(this).hide();
    $('.app-active').remove();
});*/

$(document).on('click', '.item', function (e) {

    var item = $('.select-item[data-num="' + Dolls.selectedItem + '"]'), app = '', appActive = '', mp = '';
    item.removeClass('active');

    var active = item.find('.active-item'),
        actualType = $(this).attr('data-type');

    var allmp = parseInt(document.getElementById("mp").textContent);


    if (active.length > 0) {

        var itemData = Dolls.actualList[$(this).attr('id')]

        if (actualType == 'weapon') {
            // Смотрим есть ли щит и можно ли щит под это оружие

            if (Dolls.allTypes['0004'] != 0 && itemData['no-shield'] == 'Y') {
                alert('К этому оружию запрещен щит');
                return false;
            }
        }

        if (itemData['improvement'] > 0) {
            app = $('<div>').addClass('app').html('+<span class="app-span">' + itemData['improvement'] + '</span>');
        }

        /*if(itemData['mp'] > 0){
            allmp = parseInt(allmp) + parseInt(itemData['mp']);
        }*/

        //console.log(mp);


        $(active[0]).css('background-image', 'url("' + $(this).attr('data-image') + '")')
            .attr('data-max-app', itemData['improvement'])
            .html(app);

        //$('#mp').html(allmp);

        Dolls.allTypes[Dolls.selectedItem] = {
            'id': $(this).attr('id'),
            'app': 0,
            'mp': itemData['mp'],
            'weight': itemData['weight'],
            'str': itemData['str'],
            'dex': itemData['dex'],
            'iint': itemData['iint'],
            'pv': itemData['pv'],
            'hp': itemData['hp'],
            'improvement': itemData['improvement'],
            'data': itemData
        };

        Dolls.UpdateDollInformation();

        var appCl = $(active[0]).find('.app');
        appCl.click();
    }
});

$('#s-s').on('input', function (e) {
    Dolls.Search(this);
});

$(document).ready(function () {

    if (LoadDollParams !== false) {
        for (itemKey in LoadDollParams) {
            //console.log(itemKey);
            Dolls.allTypes[itemKey] = LoadDollParams[itemKey];
        }
    }


    var getlevel = 1
    if (getlevel) {
        var inputF = document.getElementById("level");
        //Dolls.allTypes = getdoll;
        inputF.value = getlevel;
    }

    if (Dolls.allTypes) {
        var countUpdateItems = -1;
        var app, active, item;
        //var active = document.getElementsByClassName('active-item');

        //var active = item.find('.active-item'),
        //actualType = $(this).attr('data-type');

        for (var keyItem in Dolls.allTypes) {
            app = '';
            item = '';
            active = '';
            countUpdateItems++;
            item = $('.select-item[data-num="' + keyItem + '"]');
            active = item.find('.active-item');
            //item.addClass('app');

            if (Dolls.allTypes[keyItem] !== 0) {
                //console.log(keyItem + ' ' + countUpdateItems);
                if (Dolls.allTypes[keyItem].improvement > 0) {
                    app = $('<div>').addClass('app').html('+<span class="app-span">' + Dolls.allTypes[keyItem].improvement + '</span>');
                }
                $(active[0]).css('background-image', 'url("' + Dolls.allTypes[keyItem].data.icon + '")')
                    .attr('data-max-app', Dolls.allTypes[keyItem].improvement)
                    .html(app);

            }
        }


    }

    Dolls.UpdateDollInformation();

    var classID = $('#doll-class').val(), item;

    $('.select-item').click(function (e) {

        if ($(e.target).hasClass('active-item')) {

            var type = $(this).attr('data-type');

            var arrow = 'N', tmpApp = '';

            if (type == 'shield') {

                // Смотрим оружие
                if (Dolls.allTypes['0010'] != 0 && Dolls.allTypes['0010'].data['no-shield'] == 'Y') {
                    alert('К этому оружию запрещен щит');

                    return false;
                }

                if (Dolls.allTypes['0010'] != 0 && Dolls.allTypes['0010'].data['need-arrow'] == 'Y') {
                    arrow = 'Y';
                }
            }

            $('.select-item.active').removeClass('active');
            $(this).addClass('active');

            Dolls.selectedItem = $(this).attr('data-num'); // type
            Dolls.selectedType = type;
            Dolls.actualList = {};

            $.ajax({
                url: '/ror-game/doll/getitems',
                type: 'post',
                data: {
                    '_xfToken': document.getElementsByName('_xfToken')[0].value,
                    '_xfResponseType': "json",
                    'type': type,
                    'classID': classID,
                    'num': Dolls.selectedItem,
                    'arrow': arrow
                },
                dataType: 'json',
                success: function (json) {

                    // actualList.
                    if ((json.message == "Success") && (json.items.length > 0)) {

                        $('#full-info-doll').hide();
                        $('#load-items').show().html('');
                        $('.simple-search').show().find('input').val('');


                        if (!$('[data-id="load-items"]').hasClass('active')) {
                            $('[data-id="full-info-doll"]').removeClass('active');
                            $('[data-id="load-items"]').addClass('active');
                        }

                        for (var i = json.items.length - 1; i >= 0; i--) {

                            Dolls.actualList[json.items[i].id] = json.items[i];

                            /* tmpApp = '';
                            if(json.items[i].improvement > 0){
                                tmpApp = '+0 ';
                            }*/

                            item = $('<div></div>').html(
                                '<div class="item" id="' + json.items[i].id + '" data-image="' + json.items[i].icon + '" data-type="' + type + '">' +
                                '<div class="icon"><img src="' + json.items[i].icon + '" alt=""></div>' +
                                '<div class="title">' + json.items[i].title + '</div>' +
                                '</div>'
                            );

                            $('#load-items').attr('data-actual-type', type).append(item);
                        }

                    } else {
                        alert("List Empty :(");
                    }
                }
            });
        }
    }).contextmenu(function (e) {
        if ($(e.target).hasClass('active-item')) {
            $(this).find('.active-item').removeAttr('style').removeAttr('data-max-app').html('');
            Dolls.allTypes[$(this).attr('data-num')] = 0;

            Dolls.UpdateDollInformation();

            return false;
        }
    });

    $('.change-rightside').click(function () {
        $(this).parents('ul').find('.select-class.active').removeClass('active');

        var parent = $(this).parent();
        parent.addClass('active');

        $('#' + parent.data('id')).show();
        $('#' + parent.data('id-not')).hide();

        if (parent.data('id-not') != 'full-info-doll') {
            $('.simple-search').hide();//.find('input').val('');
        } else {
            $('.simple-search').show().find('input').val('');
        }

        $('.select-item.active').removeClass('active');

        return false;
    });


    $('html').keydown(function (eventObject) {
        if (event.keyCode == 27) {
            $('.modal').hide();
            $('.modal-bg').hide();
        }
    });

    $('.btn-close').click(function () {
        $('.modal').hide();
        $('.modal-bg').hide();
    });


    $('.modal-bg').click(function () {
        $('.modal').hide();
        $('.modal-bg').hide();
    });

    $('#set-tree').click(function () {
        $('.modal-bg').show();
        $('#modal-show-save').show();
        PositionModal('modal-show-save');

    });

    $('#set-screenshot').click(function () {

        /*$.ajax({
            url: '/ajax/Dolls/SetScreenshot/',
            data: {
                'content': Dolls.allTypes,
                'id-class': $('#doll-class').val()
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
                $('#global-preloader').hide();

                if(result.type == 'success'){

                    //console.log(result.type);

                    $('#result-save-screen').attr('src', result.image);
                    $('#result-save-screen-input').html(result.image);
                    $('.modal-bg').show();
                    $('#modal-show-screen').show();


                    PositionModal('modal-show-screen');
                }
            }
        });*/


        //console.log(result.type);

        /* $('#result-save-screen').attr('src', 1);
                    $('#result-save-screen-input').html(1);
                    $('.modal-bg').show();
                    $('#modal-show-screen').show();


                    PositionModal('modal-show-screen');*/
        $("html").addClass("hide-scrollbar");
        $('html,body').scrollTop(0);
        var el = document.getElementById('doll-layout');
        html2canvas(el, {
            //scrollX: -window.pageXOffset,
            //scrollY: -window.pageYOffset,
            //useCORS: true,
            width: el.offsetWidth,
            height: el.offsetHeight,
            // dpi: 200,

            /*onclone: function(document) {
  document.querySelector('.doll-layout').style.display = 'block';
},*/
            backgroundColor: null
        }).then(canvas => {
            var imageData = canvas.toDataURL("image/png");
            $('#result-save-screen').attr('src', canvas.toDataURL("image/png"));

            var dl = document.getElementById('scrlink');
            dl.setAttribute("download", "doll.png");
            dl.setAttribute("href", imageData);
            // dl.click ();
        });
        $("html").removeClass("hide-scrollbar");
        $('.modal-bg').show();
        $('#modal-show-screen').show();
        PositionModal('modal-show-screen');

    });

});
