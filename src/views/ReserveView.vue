<script setup lang="ts"></script>

<template>
  <!-- ページタイトルと進み具合（ステップ） -->
  <div class="page-header">
    <div class="page-header__inner">
      <h1 class="page-header__title">ご予約</h1>
      <ol class="steps">
        <li class="steps__item is-current" aria-current="step">1 日程・人数</li>
        <li class="steps__item">2 オプション</li>
        <li class="steps__item">3 お客様情報</li>
        <li class="steps__item">4 確認・完了</li>
      </ol>
    </div>
  </div>

  <div class="reserve">
    <div class="reserve__main">
      <!-- 選んでいるプラン -->
      <div class="reserve-plan">
        <img
          class="reserve-plan__image"
          src="/images/plan-dome.webp"
          alt="ドームテントの外観"
          width="800"
          height="600"
        />
        <div class="reserve-plan__body">
          <p class="reserve-plan__name">ドームテント スタンダード</p>
          <ul class="tag-list">
            <li class="tag">定員 2〜4名</li>
            <li class="tag">ドームテント</li>
          </ul>
          <RouterLink to="/plans" class="reserve-plan__change">プランを変更する</RouterLink>
        </div>
      </div>

      <form id="reserve-form" class="reserve-form" @submit.prevent>
        <!-- 1. 日程・人数 -->
        <section class="reserve-section" aria-labelledby="step1-title">
          <h2 id="step1-title" class="reserve-section__title">1. 日程・人数を選ぶ</h2>

          <div class="calendar">
            <div class="calendar__head">
              <button type="button" class="calendar__nav" aria-label="前の月">＜</button>
              <p class="calendar__month">2026年11月</p>
              <button type="button" class="calendar__nav" aria-label="次の月">＞</button>
            </div>
            <table class="calendar__table">
              <thead>
                <tr>
                  <th scope="col">日</th>
                  <th scope="col">月</th>
                  <th scope="col">火</th>
                  <th scope="col">水</th>
                  <th scope="col">木</th>
                  <th scope="col">金</th>
                  <th scope="col">土</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <button type="button" class="calendar__day" aria-label="11月1日（日） 空きあり">
                      1<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day calendar__day--eve"
                      aria-label="11月2日（月） 空きあり 休前日料金"
                    >
                      2<span class="calendar__mark" aria-hidden="true">○</span
                      ><span class="calendar__eve" aria-hidden="true">休前日</span>
                    </button>
                  </td>
                  <td>
                    <button type="button" class="calendar__day" aria-label="11月3日（火） 空きあり">
                      3<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button type="button" class="calendar__day" aria-label="11月4日（水） 空きあり">
                      4<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月5日（木） 残りわずか"
                    >
                      5<span class="calendar__mark" aria-hidden="true">△</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月6日（金） 満室"
                      disabled
                    >
                      6<span class="calendar__mark" aria-hidden="true">×</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day calendar__day--eve"
                      aria-label="11月7日（土） 満室"
                      disabled
                    >
                      7<span class="calendar__mark" aria-hidden="true">×</span
                      ><span class="calendar__eve" aria-hidden="true">休前日</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <button type="button" class="calendar__day" aria-label="11月8日（日） 空きあり">
                      8<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button type="button" class="calendar__day" aria-label="11月9日（月） 空きあり">
                      9<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月10日（火） 空きあり"
                    >
                      10<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月11日（水） 空きあり"
                    >
                      11<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月12日（木） 残りわずか"
                    >
                      12<span class="calendar__mark" aria-hidden="true">△</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月13日（金） 空きあり"
                    >
                      13<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day calendar__day--eve is-selected"
                      aria-label="11月14日（土） 空きあり 休前日料金 チェックイン日"
                      aria-pressed="true"
                    >
                      14<span class="calendar__mark" aria-hidden="true">○</span
                      ><span class="calendar__eve" aria-hidden="true">休前日</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <button
                      type="button"
                      class="calendar__day is-checkout"
                      aria-label="11月15日（日） 空きあり チェックアウト日"
                    >
                      15<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月16日（月） 空きあり"
                    >
                      16<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月17日（火） 空きあり"
                    >
                      17<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月18日（水） 空きあり"
                    >
                      18<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月19日（木） 空きあり"
                    >
                      19<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月20日（金） 空きあり"
                    >
                      20<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day calendar__day--eve"
                      aria-label="11月21日（土） 残りわずか 休前日料金"
                    >
                      21<span class="calendar__mark" aria-hidden="true">△</span
                      ><span class="calendar__eve" aria-hidden="true">休前日</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <button
                      type="button"
                      class="calendar__day calendar__day--eve"
                      aria-label="11月22日（日） 満室"
                      disabled
                    >
                      22<span class="calendar__mark" aria-hidden="true">×</span
                      ><span class="calendar__eve" aria-hidden="true">休前日</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月23日（月） 空きあり"
                    >
                      23<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月24日（火） 空きあり"
                    >
                      24<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月25日（水） 空きあり"
                    >
                      25<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月26日（木） 空きあり"
                    >
                      26<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月27日（金） 空きあり"
                    >
                      27<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day calendar__day--eve"
                      aria-label="11月28日（土） 満室"
                      disabled
                    >
                      28<span class="calendar__mark" aria-hidden="true">×</span
                      ><span class="calendar__eve" aria-hidden="true">休前日</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月29日（日） 空きあり"
                    >
                      29<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="calendar__day"
                      aria-label="11月30日（月） 空きあり"
                    >
                      30<span class="calendar__mark" aria-hidden="true">○</span>
                    </button>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <ul class="calendar__legend">
              <li>○ 空きあり</li>
              <li>△ 残りわずか</li>
              <li>× 満室</li>
              <li>「休前日」は休前日料金</li>
            </ul>
          </div>

          <div class="reserve-section__fields reserve-section__fields--4">
            <div class="form-field">
              <label for="checkin">チェックイン</label>
              <input type="date" id="checkin" name="checkin" value="2026-11-14" required />
            </div>
            <div class="form-field">
              <label for="nights">泊数</label>
              <select id="nights" name="nights">
                <option value="1">1泊</option>
                <option value="2">2泊</option>
                <option value="3">3泊</option>
              </select>
            </div>
            <div class="form-field">
              <label for="adults">大人</label>
              <select id="adults" name="adults">
                <option value="1">1名</option>
                <option value="2" selected>2名</option>
                <option value="3">3名</option>
                <option value="4">4名</option>
              </select>
            </div>
            <div class="form-field">
              <label for="children">子ども</label>
              <select id="children" name="children">
                <option value="0">0名</option>
                <option value="1">1名</option>
                <option value="2">2名</option>
              </select>
            </div>
          </div>
        </section>

        <!-- 2. オプション -->
        <fieldset class="reserve-section">
          <legend class="reserve-section__title">2. オプションを選ぶ</legend>
          <label class="option"
            ><input type="checkbox" name="options" value="bbq" /> BBQセット<span
              class="option__price"
              >＋[　]円／1名</span
            ></label
          >
          <label class="option"
            ><input type="checkbox" name="options" value="fire" /> 焚き火セット<span
              class="option__price"
              >＋[　]円／1組</span
            ></label
          >
          <label class="option"
            ><input type="checkbox" name="options" value="breakfast" /> 朝食<span
              class="option__price"
              >＋[　]円／1名</span
            ></label
          >
          <label class="option"
            ><input type="checkbox" name="options" value="late" /> レイトチェックアウト<span
              class="option__price"
              >＋[　]円／1組</span
            ></label
          >
        </fieldset>

        <!-- 3. お客様情報 -->
        <section class="reserve-section" aria-labelledby="step3-title">
          <h2 id="step3-title" class="reserve-section__title">3. お客様情報</h2>
          <div class="reserve-section__fields reserve-section__fields--2">
            <div class="form-field">
              <label for="name">お名前<span class="required">必須</span></label>
              <input
                type="text"
                id="name"
                name="name"
                autocomplete="name"
                placeholder="山田 太郎"
                required
              />
            </div>
            <div class="form-field">
              <label for="kana">フリガナ<span class="required">必須</span></label>
              <input type="text" id="kana" name="kana" placeholder="ヤマダ タロウ" required />
            </div>
            <div class="form-field">
              <label for="tel">電話番号<span class="required">必須</span></label>
              <input
                type="tel"
                id="tel"
                name="tel"
                autocomplete="tel"
                placeholder="090-1234-5678"
                required
              />
            </div>
            <div class="form-field">
              <label for="arrival">到着予定時刻<span class="required">必須</span></label>
              <select id="arrival" name="arrival" required>
                <option value="">選択してください</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
              </select>
            </div>
            <div class="form-field">
              <label for="email">メールアドレス<span class="required">必須</span></label>
              <input
                type="email"
                id="email"
                name="email"
                autocomplete="email"
                placeholder="taro@example.com"
                required
              />
            </div>
            <div class="form-field">
              <label for="email-confirm"
                >メールアドレス（確認用）<span class="required">必須</span></label
              >
              <input
                type="email"
                id="email-confirm"
                name="email_confirm"
                autocomplete="off"
                required
              />
            </div>
            <div class="form-field form-field--full">
              <label for="memo">ご要望（任意）</label>
              <textarea
                id="memo"
                name="memo"
                rows="4"
                placeholder="記念日・アレルギーなど"
              ></textarea>
            </div>
          </div>
        </section>
      </form>
    </div>

    <!-- 料金の内訳（PCでは右側に固定） -->
    <aside class="summary" aria-labelledby="summary-title">
      <h2 id="summary-title" class="summary__title">料金の内訳</h2>
      <dl class="summary__list">
        <div class="summary__row">
          <dt>宿泊（平日）</dt>
          <dd>[　]円 × [　]泊</dd>
        </div>
        <div class="summary__row">
          <dt>宿泊（休前日）</dt>
          <dd>[　]円 × [　]泊</dd>
        </div>
        <div class="summary__row">
          <dt>人数</dt>
          <dd>大人2名・子ども0名</dd>
        </div>
        <div class="summary__row">
          <dt>オプション</dt>
          <dd>[　]円</dd>
        </div>
        <div class="summary__row summary__row--total">
          <dt>合計（税込）</dt>
          <dd>[　]円</dd>
        </div>
      </dl>
      <button type="submit" form="reserve-form" class="button button--primary summary__button">
        予約内容を確認する
      </button>
    </aside>
  </div>

  <!-- スマホ用：合計と確認ボタンを画面下に固定 -->
  <div class="summary-bar">
    <p class="summary-bar__total"><span>合計（税込）</span>[　]円</p>
    <button type="submit" form="reserve-form" class="button button--primary">確認する</button>
  </div>

  <!-- 予約の確認ポップアップ（JSで開く） -->
  <dialog id="confirm-dialog" class="confirm-dialog" aria-labelledby="confirm-title">
    <div class="confirm-dialog__head">
      <h2 id="confirm-title" class="confirm-dialog__title">ご予約内容の確認</h2>
      <form method="dialog">
        <button type="submit" class="confirm-dialog__close" aria-label="閉じる">×</button>
      </form>
    </div>
    <dl class="confirm-dialog__list">
      <dt>プラン</dt>
      <dd>ドームテント スタンダード</dd>
      <dt>日程</dt>
      <dd>11月14日（土）〜1泊</dd>
      <dt>人数</dt>
      <dd>大人2名・子ども0名</dd>
      <dt>オプション</dt>
      <dd>[選んだオプション]</dd>
      <dt>お名前</dt>
      <dd>[お名前]</dd>
      <dt>連絡先</dt>
      <dd>[電話番号]／[メールアドレス]</dd>
      <dt>合計（税込）</dt>
      <dd class="confirm-dialog__total">[　]円</dd>
    </dl>
    <div class="confirm-dialog__actions">
      <form method="dialog">
        <button type="submit" class="button">戻って修正する</button>
      </form>
      <button type="button" class="button button--primary">予約を確定する</button>
    </div>
  </dialog>
</template>
